import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { parseProducerSignature, isSignatureExpired, computeHmacSignature, verifyProducerSignature } from '../webhook-signature.js';
import { ZeptoMailSignatureConstants } from '../../../shared/constants.js';

// FriendDev: Known test key matching what ZEPTO_AUTH_KEY would be in env (set in test/setup.ts).
const TEST_AUTH_KEY = process.env.ZEPTO_AUTH_KEY!;

describe('Webhook Signature Utilities', () => {

  // ==========================================================================
  // parseProducerSignature
  // ==========================================================================

  describe('parseProducerSignature', () => {

    it('should parse a valid producer-signature header', () => {
      const header = 'ts=1596109465823;s=dN0yVozgabP5NPlxMDfP1r5u65bVO9kTGEZMIQlqI2o=;s-algorithm=HmacSHA256';

      const result = parseProducerSignature(header);

      expect(result).not.toBeNull();
      expect(result!.ts).toBe(1596109465823);
      expect(result!.s).toBe('dN0yVozgabP5NPlxMDfP1r5u65bVO9kTGEZMIQlqI2o=');
      expect(result!.sAlgorithm).toBe('HmacSHA256');
    });

    it('should parse a URL-encoded producer-signature header', () => {
      const header = 'ts=1596109465823;s=dN0yVozgabP5NPlxMDfP1r5u65bVO9kTGEZMIQlqI2o%3D;s-algorithm=HmacSHA256';

      const result = parseProducerSignature(header);

      expect(result).not.toBeNull();
      expect(result!.s).toBe('dN0yVozgabP5NPlxMDfP1r5u65bVO9kTGEZMIQlqI2o=');
    });

    it('should return null for a header missing the signature field', () => {
      const header = 'ts=1596109465823;s-algorithm=HmacSHA256';

      expect(parseProducerSignature(header)).toBeNull();
    });

    it('should return null for a header missing the timestamp field', () => {
      const header = 's=abc123;s-algorithm=HmacSHA256';

      expect(parseProducerSignature(header)).toBeNull();
    });

    it('should return null for a header with a non-numeric timestamp', () => {
      const header = 'ts=notanumber;s=abc123;s-algorithm=HmacSHA256';

      expect(parseProducerSignature(header)).toBeNull();
    });

    it('should return null for an empty string', () => {
      expect(parseProducerSignature('')).toBeNull();
    });

    it('should return null for a malformed header with no delimiters', () => {
      expect(parseProducerSignature('garbage')).toBeNull();
    });
  });

  // ==========================================================================
  // isSignatureExpired
  // ==========================================================================

  describe('isSignatureExpired', () => {

    it('should return false for a timestamp within the acceptable window', () => {
      // FriendDev: Simulate a signature sent 1 minute ago.
      const recentTimestamp = Date.now() - 60000;

      expect(isSignatureExpired(recentTimestamp)).toBe(false);
    });

    it('should return true for a timestamp outside the acceptable window', () => {
      // FriendDev: Simulate a signature sent 10 minutes ago (beyond 5 min limit).
      const staleTimestamp = Date.now() - 600000;

      expect(isSignatureExpired(staleTimestamp)).toBe(true);
    });

    it('should return false for a timestamp exactly at the boundary', () => {
      // FriendDev: Exactly at the limit should not be expired (uses > not >=).
      const boundaryTimestamp = Date.now() - ZeptoMailSignatureConstants.AcceptableDurationMs;

      expect(isSignatureExpired(boundaryTimestamp)).toBe(false);
    });
  });

  // ==========================================================================
  // computeHmacSignature
  // ==========================================================================

  describe('computeHmacSignature', () => {

    it('should produce a deterministic Base64 signature for a known input/key pair', () => {
      const payload = '{"event_name":["hardbounce"]}';
      const key = 'test-secret-key';

      // FriendDev: Independently compute the expected value.
      const expected = createHmac('sha256', key)
        .update(payload, 'utf8')
        .digest('base64');

      const result = computeHmacSignature(payload, key);

      expect(result).toBe(expected);
    });

    it('should produce different signatures for different payloads', () => {
      const key = 'test-secret-key';

      const sig1 = computeHmacSignature('payload-one', key);
      const sig2 = computeHmacSignature('payload-two', key);

      expect(sig1).not.toBe(sig2);
    });

    it('should produce different signatures for different keys', () => {
      const payload = 'same-payload';

      const sig1 = computeHmacSignature(payload, 'key-one');
      const sig2 = computeHmacSignature(payload, 'key-two');

      expect(sig1).not.toBe(sig2);
    });
  });

  // ==========================================================================
  // verifyProducerSignature
  // ==========================================================================

  describe('verifyProducerSignature', () => {

    it('should return true for a correctly signed payload', () => {
      const payload = '{"event_name":["hardbounce"],"event_message":[]}';

      // FriendDev: Generate a valid signature using the test key.
      const validSignature = createHmac('sha256', TEST_AUTH_KEY)
        .update(payload, 'utf8')
        .digest('base64');

      const signature = {
        ts: Date.now(),
        s: validSignature,
        sAlgorithm: 'HmacSHA256',
      };

      expect(verifyProducerSignature(signature, payload)).toBe(true);
    });

    it('should return false for an incorrect signature', () => {
      const payload = '{"event_name":["hardbounce"]}';

      const signature = {
        ts: Date.now(),
        s: 'definitelyNotAValidSignature==',
        sAlgorithm: 'HmacSHA256',
      };

      expect(verifyProducerSignature(signature, payload)).toBe(false);
    });

    it('should return false when the payload has been tampered with', () => {
      const originalPayload = '{"event_name":["hardbounce"]}';
      const tamperedPayload = '{"event_name":["softbounce"]}';

      // FriendDev: Sign the original, but verify against the tampered version.
      const validSignature = createHmac('sha256', TEST_AUTH_KEY)
        .update(originalPayload, 'utf8')
        .digest('base64');

      const signature = {
        ts: Date.now(),
        s: validSignature,
        sAlgorithm: 'HmacSHA256',
      };

      expect(verifyProducerSignature(signature, tamperedPayload)).toBe(false);
    });
  });
});
