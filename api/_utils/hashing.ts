import { createHmac } from 'node:crypto';
import { CryptoConstants } from '../../shared/constants.js';

const getPepper = (): string => {
  const pepper = process.env.HASH_PEPPER;

  if (!pepper) {
    throw new Error('CRITICAL: HASH_PEPPER is missing from environment variables.');
  }

  return pepper;
}

const PEPPER = getPepper();

/**
 * Hash an email address using SHA-256 and the current pepper.
 * @param email - The email address to hash.
 * @returns The hashed email address.
 */
export const hashEmail = (email: string): string => {
  const cleanEmail = email.trim().toLowerCase();

  return createHmac(CryptoConstants.HashType, PEPPER).update(cleanEmail).digest(CryptoConstants.EncodingFormat);
}
