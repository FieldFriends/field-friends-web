import { CryptoConfig } from '../../shared/constants.js';

type Delimiter = typeof CryptoConfig.Session.EncryptionDelimiter;

export type AesGcmEncryptedPayload = `${string}${Delimiter}${string}${Delimiter}${string}${Delimiter}${string}`;

export interface EncryptionSession {
  /**
   * HKDF entropy extraction salt.
   * Safe to be stored.
   */
  salt: string;

  /**
   * The final derived AES key from Hybrid KEM process.
   * This should not be stored.
   */
  derivedSessionKey: Buffer;

  /**
   * RSA-encrypted portion of the shared secret.
   * Safe to be stored.
   */
  rsaCiphertext: string;

  /**
   * ML-KEM encapsulated ciphertext.
   * Safe to be stored.
   */
  mlkemCiphertext: string;
}