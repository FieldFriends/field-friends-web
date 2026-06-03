export interface EncryptionSession {
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