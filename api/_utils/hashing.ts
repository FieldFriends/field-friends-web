import { scrypt, createHmac, type ScryptOptions } from 'node:crypto';
import { Algorithms, Encodings, CryptoConfig } from '../../shared/constants.js';
import { SERVER_ENV } from './server-env.js';

/**
 * Derives a strong hash from a value and a pepper using scrypt.
 * @param value - The cleartext value to hash.
 * @param pepper - The secret pepper to use for the KDF.
 * @returns The resulting derived key hash as a hex string.
 */
const hashString = async (value: string, pepper: string): Promise<string> => {
  if (!value) {
    return '';
  }

  const scryptOptions: ScryptOptions = {
    N: CryptoConfig.Scrypt.Cost,
    r: CryptoConfig.Scrypt.BlockSize,
    p: CryptoConfig.Scrypt.Parallelization,
    maxmem: CryptoConfig.Scrypt.MaxMem,
  };

  const scryptExecutor = (resolve: (value: Buffer) => void, reject: (reason: Error) => void): void => {
    const callback = (err: Error | null, key: Buffer): void => {
      if (err) {
        reject(err);
      } else {
        resolve(key);
      }
    };

    scrypt(value, pepper, CryptoConfig.Scrypt.KeyLength, scryptOptions, callback);
  };

  const derivedKeyPromise: Promise<Buffer> = new Promise<Buffer>(scryptExecutor);
  const derivedKey: Buffer = await derivedKeyPromise;

  return derivedKey.toString(Encodings.Hex);
};

/**
 * Hashes an email address to prevent dictionary attacks on low-entropy strings.
 * @param email - The cleartext email address.
 * @returns The scrypt-derived hash of the email.
 */
export const hashEmail = async (email: string): Promise<string> => {
  if (!email) {
    throw new Error('No email provided.');
  }

  const cleanEmail = email.trim().toLowerCase();

  return await hashString(cleanEmail, SERVER_ENV.HASH_PEPPER);
};

/**
 * Hashes a user ID to generate a mathematically un-linkable response ID.
 * @param userId - The cleartext user ID.
 * @returns The HMAC-SHA512 derived response ID.
 */
export const hashResponseId = (userId: string): string => {
  if (!userId) {
    throw new Error('No user ID provided.');
  }

  return createHmac(Algorithms.SHA512, SERVER_ENV.USER_HASH_PEPPER)
    .update(userId)
    .digest(Encodings.Hex);
};
