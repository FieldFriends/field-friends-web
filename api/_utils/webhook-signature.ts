import { createHmac, timingSafeEqual } from 'node:crypto';
import { ProducerSignatureSchema, type ProducerSignature } from '../../shared/schemas/zeptoMailWebhookSchema.js';
import { Algorithms, Encodings, ZeptoMailConfig } from '../../shared/constants.js';
import { SERVER_ENV } from './server-env.js';

/**
 * Parse the raw producer-signature header into its typed components.
 * Expected format: ts=<timestamp>;s=<signature>;s-algorithm=<algorithm>
 * @param rawHeader - The raw, potentially URL-encoded header value.
 * @returns The parsed ProducerSignature, or null if the header is malformed.
 */
export const parseProducerSignature = (rawHeader: string): ProducerSignature | null => {
  // FriendDev: ZeptoMail URL-encodes the signature header value (e.g. %3D for =).
  //            Decode it first so we can split cleanly.
  const decoded = decodeURIComponent(rawHeader);

  const fields = decoded.split(ZeptoMailConfig.HeaderDelimiter);

  // FriendDev: Build a lookup map from the key=value pairs.
  //            Using indexOf ensures we don't break on '=' inside Base64 values.
  const fieldMap = new Map<string, string>();

  for (const field of fields) {
    const separatorIndex = field.indexOf(ZeptoMailConfig.FieldDelimiter);

    if (separatorIndex === -1) {
      return null;
    }

    const key = field.substring(0, separatorIndex);
    const value = field.substring(separatorIndex + 1);

    fieldMap.set(key, value);
  }

  // FriendDev: Extract the raw field values using our named constants,
  //            then validate the shape with our Zod schema.
  const tsRaw = fieldMap.get(ZeptoMailConfig.Fields.Timestamp);

  if (!tsRaw) {
    return null;
  }

  const rawSignatureObject = {
    ts: Number.parseInt(tsRaw, 10),
    s: fieldMap.get(ZeptoMailConfig.Fields.Signature),
    sAlgorithm: fieldMap.get(ZeptoMailConfig.Fields.SigningAlgorithm),
  };

  const parseResult = ProducerSignatureSchema.safeParse(rawSignatureObject);

  if (!parseResult.success) {
    return null;
  }

  return parseResult.data;
};

/**
 * Check if the signature timestamp has exceeded the acceptable duration window.
 * @param timestamp - The timestamp (ms) from the producer-signature.
 * @returns True if the signature is expired, false if it is still within the acceptable window.
 */
export const isSignatureExpired = (timestamp: number): boolean => {
  const elapsed = Date.now() - timestamp;

  return elapsed > ZeptoMailConfig.AcceptableDurationMs;
};

/**
 * Compute the HMAC-SHA256 signature of the given payload using the secret key.
 * @param payload - The data string to sign.
 * @param secretKey - The secret key to use for HMAC computation.
 * @returns The Base64-encoded HMAC signature.
 */
export const computeHmacSignature = (payload: string, secretKey: string): string => {
  return createHmac(Algorithms.SHA256, secretKey)
    .update(payload)
    .digest(Encodings.Base64);
};

/**
 * Securely verify a producer signature against the computed HMAC of the payload.
 * Uses constant-time comparison to prevent timing attacks.
 * @param signature - The parsed ProducerSignature from the request header.
 * @param payload - The raw payload string that was signed.
 * @returns True if the signature is valid, false otherwise.
 */
export const verifyProducerSignature = (signature: ProducerSignature, payload: string): boolean => {
  const expectedSignature = computeHmacSignature(payload, SERVER_ENV.ZEPTO_AUTH_KEY);

  // FriendDev: Both values are Base64 strings. Convert to Buffers for timingSafeEqual,
  //            which requires equal-length buffers.
  const expectedBuffer = Buffer.from(expectedSignature, Encodings.Base64);
  const receivedBuffer = Buffer.from(signature.s, Encodings.Base64);

  // FriendDev: If the lengths differ, the signatures cannot match.
  //            Return false immediately to avoid timingSafeEqual throwing.
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
};
