export interface EncryptionSession {
  /**
   * The raw AES key that is used to encrypt fields in this session.
   * This should not be stored.
   */
  rawSessionKey: Buffer;

  /**
   * The AES key after it has been encrypted with RSA.
   * Safe to be stored.
   */
  encryptedSessionKey: string;
}