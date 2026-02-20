import { describe, it, expect } from 'vitest';
import { encryptWithAes, startEncryptionSession } from '../crypto';
import { createDecipheriv, privateDecrypt, constants } from 'node:crypto';

// Retrieve the private key we generated in setup.ts
const TEST_PRIVATE_KEY = (globalThis as any).__TEST_PRIVATE_KEY__;

/**
 * Simulates local script decrypting data.
 * Since the API doesn't decrypt, we must do it manually here.
 */
const manualDecrypt = (encryptedData: string, rawKey: Buffer) => {
  const [ivHex, authTagHex, encryptedTextHex] = encryptedData.split(':');

  const decipher = createDecipheriv(
    'aes-256-gcm',
    rawKey,
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedTextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

describe('Crypto Utility (Hybrid Envelope)', () => {

  it('should generate a valid encryption session', () => {
    const session = startEncryptionSession();

    expect(Buffer.isBuffer(session.rawSessionKey)).toBe(true);
    expect(session.rawSessionKey.length).toBe(32);

    expect(typeof session.encryptedSessionKey).toBe('string');
    expect(session.encryptedSessionKey.length).toBeGreaterThan(0);
  });

  it('should encrypt data that can be successfully decrypted', () => {
    const originalText = 'Chair on a boat';
    const session = startEncryptionSession();

    const encrypted = encryptWithAes(originalText, session.rawSessionKey);

    const decrypted = manualDecrypt(encrypted, session.rawSessionKey);

    expect(decrypted).toBe(originalText);
  });

  it('should ensure the Session Key is decryptable using the Private Key', () => {
    const session = startEncryptionSession();

    const decryptedSessionKey = privateDecrypt(
      {
        key: TEST_PRIVATE_KEY,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(session.encryptedSessionKey, 'hex')
    );

    expect(decryptedSessionKey.equals(session.rawSessionKey)).toBe(true);
  });

  it('should generate different outputs for the same input (Random IV)', () => {
    const text = 'Static text';
    const session = startEncryptionSession();

    const run1 = encryptWithAes(text, session.rawSessionKey);
    const run2 = encryptWithAes(text, session.rawSessionKey);

    expect(run1).not.toBe(run2);

    expect(manualDecrypt(run1, session.rawSessionKey)).toBe(text);
    expect(manualDecrypt(run2, session.rawSessionKey)).toBe(text);
  });

  it('should throw an error if the ciphertext is tampered with (GCM Integrity)', () => {
    const originalText = 'Do not change me';
    const session = startEncryptionSession();
    const encrypted = encryptWithAes(originalText, session.rawSessionKey);

    // Break the encrypted string into parts
    const [iv, authTag, ciphertext] = encrypted.split(':');

    // Maliciously alter the last character of the ciphertext
    const corruptedCiphertext = ciphertext.substring(0, ciphertext.length - 1) + '0';
    const corruptedString = `${iv}:${authTag}:${corruptedCiphertext}`;

    // The GCM Auth Tag should detect the mismatch and throw an error
    expect(() => manualDecrypt(corruptedString, session.rawSessionKey)).toThrow();
  });

  it('should correctly handle emojis and special characters', () => {
    const originalText = 'I love 🍕 and 🎻!';
    const session = startEncryptionSession();

    const encrypted = encryptWithAes(originalText, session.rawSessionKey);
    const decrypted = manualDecrypt(encrypted, session.rawSessionKey);

    expect(decrypted).toBe(originalText);
  });
});