import { describe, it, expect } from 'vitest';
import { encryptWithAes, startEncryptionSession } from '../crypto.js';
import { Algorithms, Encodings, CryptoConfig } from '../../../shared/constants.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

describe('Cryptography Utils', () => {
  const fixturesDir = path.join(process.cwd(), 'test', 'fixtures');
  const rsaPriv = fs.readFileSync(path.join(fixturesDir, 'rsa-priv.pem'), Encodings.Utf8);
  const mlkemPriv = fs.readFileSync(path.join(fixturesDir, 'mlkem-priv.pem'), Encodings.Utf8);

  it('should cryptographically prove that frontend hybrid KEM can be decrypted', async () => {
    // FriendDev: Start encryption session.
    const session = await startEncryptionSession();
    const originalText = 'Super secret user data: Social Security Number, DOB, etc.';

    // FriendDev: Encrypt all data.
    const encryptedTextFormat = encryptWithAes(originalText, session.derivedSessionKey, session.salt);

    // FriendDev: Test decrypting: recover RSA entropy.
    const rsaSecret = crypto.privateDecrypt(
      {
        key: rsaPriv,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: Algorithms.SHA512,
      },
      Buffer.from(session.rsaCiphertext, Encodings.Hex)
    );

    // FriendDev: Recover ML-KEM shared secret.
    const mlkemKeyObject = crypto.createPrivateKey(mlkemPriv);
    const mlkemSecret = crypto.decapsulate(
      mlkemKeyObject,
      Buffer.from(session.mlkemCiphertext, Encodings.Hex)
    );

    // FriendDev: Re-derive AES session key using HKDF-SHA512.
    const ikm = Buffer.concat([Buffer.from(mlkemSecret), rsaSecret]);
    const saltBuffer = Buffer.from(session.salt, Encodings.Hex);
    const infoBuffer = Buffer.from(CryptoConfig.Session.HkdfInfo, Encodings.Utf8);
    const derivedSessionKey = Buffer.from(crypto.hkdfSync(Algorithms.SHA512, ikm, saltBuffer, infoBuffer, CryptoConfig.Session.AesKeyLength));

    // FriendDev: Assert backend derived same AES key as frontend.
    expect(derivedSessionKey).toEqual(session.derivedSessionKey);

    // FriendDev: Parse AES payload.
    const parts = encryptedTextFormat.split(CryptoConfig.Session.EncryptionDelimiter);
    expect(parts).toHaveLength(4);
    const [saltHex, ivHex, authTagHex, cipherHex] = parts;

    const iv = Buffer.from(ivHex, Encodings.Hex);
    const authTag = Buffer.from(authTagHex, Encodings.Hex);
    const ciphertext = Buffer.from(cipherHex, Encodings.Hex);

    // FriendDev: Decrypt AES payload.
    const decipher = crypto.createDecipheriv(Algorithms.AES_256_GCM, derivedSessionKey, iv);
    decipher.setAuthTag(authTag);
    const updateBuffer = decipher.update(ciphertext, undefined, Encodings.Utf8);
    const finalBuffer = decipher.final(Encodings.Utf8);
    const decryptedText = updateBuffer + finalBuffer;

    // FriendDev: Decrypted text must match original plaintext.
    expect(decryptedText).toBe(originalText);
  });

  it('should encrypt strings with AES-256-GCM nondeterministically', async () => {
    const session = await startEncryptionSession();
    const originalText = 'Super secret user data';

    const encrypted1 = encryptWithAes(originalText, session.derivedSessionKey, session.salt);
    const encrypted2 = encryptWithAes(originalText, session.derivedSessionKey, session.salt);

    expect(typeof encrypted1).toBe('string');
    expect(encrypted1.length).toBeGreaterThan(0);

    // FriendDev: IV is random. Same plaintext should not equal same ciphertext.
    expect(encrypted1).not.toBe(encrypted2);
  });
});