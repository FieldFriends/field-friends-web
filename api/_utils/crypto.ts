import { createCipheriv, publicEncrypt, randomBytes, constants } from 'node:crypto';
import type { EncryptionSession } from '@api/types/EncryptionSession';
import { CryptoConstants } from '@shared/constants';

/**
 * Safely retrieve the public key, ensuring newlines are formatted correctly.
 * @throws Error if the key is missing from environment variables.
 */
export const getPublicKey = (): string => {
  const key = (process.env.FIELD_FRIENDS_PUBLIC_KEY || '').replaceAll(String.raw`\n`, '\n').trim();

  // FriendDev: Fail if we have a bad encryption key.
  if (!key) {
    throw new Error('CRITICAL: FIELD_FRIENDS_PUBLIC_KEY is missing from environment variables.');
  }

  return key;
};

const PUBLIC_KEY = getPublicKey();



/**
 * Generates a temporary AES-256 key for this specific user submission.
 * @returns - The raw key, for use with immediate encrypting, and the RSA-encrypted version for database storage.
 */
export const startEncryptionSession = (): EncryptionSession => {
  const rawSessionKey = randomBytes(CryptoConstants.AesKeyLength);

  const publicKeyConfig = {
    key: PUBLIC_KEY,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: CryptoConstants.HashType
  };

  const encryptedBuffer = publicEncrypt(publicKeyConfig, rawSessionKey);

  return {
    rawSessionKey: rawSessionKey,
    encryptedSessionKey: encryptedBuffer.toString(CryptoConstants.EncodingFormat),
  };
}

/**
 * Encrypt cleartext using AES-256-GCM. Output format will be "iv:authTag:encryptedText".
 * @param text - Cleartext.
 */
export const encryptWithAes = (text: string, rawSessionKey: Buffer): string => {
  if (!text) {
    return '';
  }

  // FriendDev: Generate unique initialization vector.
  //            This allows the same text to result in different encrypted outputs
  //            in different iterations.
  //            GCM is designed to use 12 bytes (96 bits).
  const iv = randomBytes(12);

  // FriendDev: Initialize the cipher.
  //            This pre-calculates the internal key schedule 
  //            and the hash key required for GCM signing.
  const cipher = createCipheriv(CryptoConstants.AesAlgorithm, rawSessionKey, iv);

  // FriendDev: Give it the raw text we want to encrypt, then tell it the text's
  //            format and encoding to update the cipher.
  let encryptedText = cipher.update(text, CryptoConstants.TextEncoding, CryptoConstants.EncodingFormat);

  // FriendDev: AES-GCM is a stream mode (based on CTR) and does not use 
  //            block padding. However, we must call final() 
  //            to flush any remaining bytes from OpenSSL's internal buffer 
  //            and finalize the GMAC state for the Auth Tag.
  encryptedText = `${encryptedText}${cipher.final(CryptoConstants.EncodingFormat)}`;


  // FriendDev: Extract the security signature so we know the data is unaltered.
  const authTag = cipher.getAuthTag().toString(CryptoConstants.EncodingFormat);

  // FriendDev: Concatenate with our delimiter (":").
  return `${iv.toString(CryptoConstants.EncodingFormat)}${CryptoConstants.EncryptionDelimiter}${authTag}${CryptoConstants.EncryptionDelimiter}${encryptedText}`;
}