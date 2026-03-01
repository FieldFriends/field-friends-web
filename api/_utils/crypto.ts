import { createCipheriv, publicEncrypt, randomBytes, constants } from 'node:crypto';
import type { EncryptionSession } from '#api/types/EncryptionSession';

const AES_ALGORITHM = 'aes-256-gcm';

// FriendDev: Delimiter between initialization vector, auth tag, and encrypted text.
const ENCRYPTION_DELIMITER = ':';
const ENCODING_FORMAT = 'hex';
const TEXT_ENCODING = 'utf8';
const AES_KEY_LENGTH = 32;
const OAEP_HASH_TYPE = 'sha256';

// FriendDev: Get public key and replace newlines with "\n".
const PUBLIC_KEY = (process.env.FIELD_FRIENDS_PUBLIC_KEY || '').replace(/\\n/g, '\n').trim();

// FriendDev: Fail if we have a bad encryption key.
if (!PUBLIC_KEY) {
  throw new Error('CRITICAL: FIELD_FRIENDS_PUBLIC_KEY is missing from environment variables.');
}

/**
 * Generates a temporary AES-256 key for this specific user submission.
 * @returns - The raw key, for use with immediate encrypting, and the RSA-encrypted version for database storage.
 */
export const startEncryptionSession = (): EncryptionSession => {
  const rawSessionKey = randomBytes(AES_KEY_LENGTH);

  const publicKeyConfig = {
    key: PUBLIC_KEY,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: OAEP_HASH_TYPE
  };

  const encryptedBuffer = publicEncrypt(publicKeyConfig, rawSessionKey);

  return {
    rawSessionKey: rawSessionKey,
    encryptedSessionKey: encryptedBuffer.toString(ENCODING_FORMAT),
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
  const cipher = createCipheriv(AES_ALGORITHM, rawSessionKey, iv);

  // FriendDev: Give it the raw text we want to encrypt, then tell it the text's
  //            format and encoding to update the cipher.
  let encryptedText = cipher.update(text, TEXT_ENCODING, ENCODING_FORMAT);

  // FriendDev: AES-GCM is a stream mode (based on CTR) and does not use 
  //            block padding. However, we must call final() 
  //            to flush any remaining bytes from OpenSSL's internal buffer 
  //            and finalize the GMAC state for the Auth Tag.
  encryptedText = `${encryptedText}${cipher.final(ENCODING_FORMAT)}`;


  // FriendDev: Extract the security signature so we know the data is unaltered.
  const authTag = cipher.getAuthTag().toString(ENCODING_FORMAT);

  // FriendDev: Concatenate with our delimiter (":").
  return `${iv.toString(ENCODING_FORMAT)}${ENCRYPTION_DELIMITER}${authTag}${ENCRYPTION_DELIMITER}${encryptedText}`;
}