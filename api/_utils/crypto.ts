import * as crypto from 'node:crypto';
import type { EncryptionSession } from '../types/EncryptionSession.js';
import { Algorithms, Encodings, CryptoConfig } from '../../shared/constants.js';
import { SERVER_ENV } from './server-env.js';

export interface RsaEncryptionConfig {
  key: crypto.KeyObject;
  padding: number;
  oaepHash: string;
}

export interface KemEncapsulationResult {
  sharedKey: Buffer;
  ciphertext: Buffer;
}

/**
 * Cleans and normalizes environment variable key strings for OpenSSL.
 * @param key - The raw key string from the environment variable.
 * @returns The normalized, PEM-compliant key string.
 */
const formatKeyString = (key: string): string => {
  // FriendDev: Strip surrounding quotes if present.
  let cleaned = key.replaceAll(/^["']|["']$/g, '');

  // FriendDev: Normalize Windows literal carriage returns.
  cleaned = cleaned.replaceAll(String.raw`\r\n`, '\n');

  // FriendDev: Normalize standard literal newlines.
  cleaned = cleaned.replaceAll(String.raw`\n`, '\n');

  // FriendDev: Strip actual carriage returns.
  cleaned = cleaned.replaceAll('\r', '');

  return cleaned.trim();
};

/**
 * Retrieves the RSA public key as a string.
 * @returns The RSA public key string.
 */
export const getPublicKey = (): string => {
  return formatKeyString(SERVER_ENV.FIELD_FRIENDS_PUBLIC_KEY);
};

/**
 * Retrieves the ML-KEM public key as a string.
 * @returns The ML-KEM public key string.
 */
const getMlKemPublicKey = (): string => {
  return formatKeyString(SERVER_ENV.FIELD_FRIENDS_MLKEM_PUBLIC_KEY);
};

// FriendDev: Pre-compute the KeyObjects for our public keys at module load time.
//            This avoids parsing the PEM strings repeatedly on each request,
//            saving CPU cycles.
const RSA_PUBLIC_KEY: crypto.KeyObject = crypto.createPublicKey(getPublicKey());
const MLKEM_PUBLIC_KEY: crypto.KeyObject = crypto.createPublicKey(getMlKemPublicKey());

/**
 * Generates a hybrid KEM session using RSA and ML-KEM-1024.
 * @returns An object containing the derived AES key and both ciphertexts.
 */
export const startEncryptionSession = async (): Promise<EncryptionSession> => {

  // FriendDev: Generate random entropy for the classical RSA portion.
  //            This generates pseudorandom data that we combine with the post-quantum secret later.
  const rsaSecret = crypto.randomBytes(CryptoConfig.Session.AesKeyLength);

  // FriendDev: Configure RSA encryption with optimal asymmetric
  //            encryption padding (OAEP) using SHA-512.
  const rsaConfig: RsaEncryptionConfig = {
    key: RSA_PUBLIC_KEY,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: Algorithms.SHA512,
  };

  // FriendDev: Encrypt our generated secret using the server's RSA public key.
  //            Only our box with the private key can decrypt this.
  const rsaEncryptedBuffer = crypto.publicEncrypt(rsaConfig, rsaSecret);
  const rsaCiphertext = rsaEncryptedBuffer.toString(Encodings.Hex);

  // FriendDev: Generate post-quantum ML-KEM encapsulation.
  //            This creates a shared secret and a ciphertext that our box
  //            can decapsulate using its ML-KEM private key.
  const { sharedKey: mlkemSecret, ciphertext: mlkemCiphertextBuffer }: KemEncapsulationResult = crypto.encapsulate(MLKEM_PUBLIC_KEY);
  const mlkemCiphertext = Buffer.from(mlkemCiphertextBuffer).toString(Encodings.Hex);

  // FriendDev: Combine the classical and post-quantum secrets securely.
  //            We use HKDF-SHA512 (NIST SP 800-56C compliant) to extract a single, 
  //            uniformly distributed session key from the concatenated secrets.
  const ikm = Buffer.concat([Buffer.from(mlkemSecret), rsaSecret]);
  const saltBuffer = Buffer.alloc(CryptoConfig.Session.HashLength, 0);
  const infoBuffer = Buffer.from(CryptoConfig.Session.HkdfInfo, Encodings.Utf8);

  // FriendDev: Extract and expand the final AES session key.
  //            The resulting key length matches the required AES key size.
  const derivedKeyArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const hkdfCallback = (err: Error | null, derivedKey: ArrayBuffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    };

    crypto.hkdf(
      Algorithms.SHA512,
      ikm,
      saltBuffer,
      infoBuffer,
      CryptoConfig.Session.AesKeyLength,
      hkdfCallback
    );
  });

  const derivedSessionKey = Buffer.from(derivedKeyArrayBuffer);

  return {
    derivedSessionKey,
    rsaCiphertext,
    mlkemCiphertext,
  };
};

/**
 * Encrypts cleartext using AES-256-GCM and the provided session key.
 * @param text - The cleartext to encrypt.
 * @param sessionKey - The derived AES session key.
 * @returns The formatted encrypted string (iv:authTag:ciphertext).
 */
export const encryptWithAes = (text: string, sessionKey: Buffer): string => {
  // FriendDev: Generate unique initialization vector.
  //            This allows the same text to result in different encrypted outputs
  //            in different iterations.
  //            GCM is designed to use 12 bytes (96 bits).
  const iv = crypto.randomBytes(12);

  // FriendDev: Initialize the cipher.
  //            This pre-calculates the internal key schedule 
  //            and the hash key required for GCM signing.
  const cipher: crypto.CipherGCM = crypto.createCipheriv(Algorithms.AES_256_GCM, sessionKey, iv);

  // FriendDev: Give it the raw text we want to encrypt, then tell it the text's
  //            format and encoding to update the cipher.
  const updateBuffer = cipher.update(text, Encodings.Utf8);

  // FriendDev: AES-GCM is a stream mode (based on CTR) and does not use 
  //            block padding. However, we must call final() 
  //            to flush any remaining bytes from OpenSSL's internal buffer 
  //            and finalize the GMAC state for the auth tag.
  const finalBuffer = cipher.final();
  const combinedBuffer = Buffer.concat([updateBuffer, finalBuffer]);
  const encryptedText = combinedBuffer.toString(Encodings.Hex);

  // FriendDev: Extract the security signature so we know the data is unaltered.
  const authTag = cipher.getAuthTag().toString(Encodings.Hex);

  // FriendDev: Concatenate with our delimiter (":").
  return `${iv.toString(Encodings.Hex)}${CryptoConfig.Session.EncryptionDelimiter}${authTag}${CryptoConfig.Session.EncryptionDelimiter}${encryptedText}`;
};