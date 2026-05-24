import crypto from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpMethods } from "../../shared/constants.js";
import { httpMethodNotAllowed, httpBadRequest, httpOk, httpForbidden, httpInternalServerError } from "../_utils/http.js";
import { ZeptoMailWebhookSchema, ZeptoMailEvents, ZeptoMailWebhookPayload, BounceDetails, FblDetails, ZeptoMailWebhookHeaders, BounceEventDataSchema, FblEventDataSchema } from "../../shared/schemas/zeptoMailWebhookSchema.js";
import { z } from "zod";
import { hashEmail } from '../_utils/hashing.js';
import { supabaseAdmin } from '../_utils/supabase-admin.js';
import { parseProducerSignature, isSignatureExpired, verifyProducerSignature } from '../_utils/webhook-signature.js';

// FriendDev: Disable Vercel's automatic body parser so we can access the raw request body.
//            This is required for HMAC signature verification, which must hash the exact
//            byte sequence sent by ZeptoMail.
export const config = {
  api: { bodyParser: false },
};

const LOG_HASH_LENGTH = 8;
const BANNED_USERS_TABLE = "banned_users";
const EMAIL_HASH_COLUMN = "email_hash";

/**
 * Bans user emails by hashing them and performing a bulk upsert into the banned_users table.
 * @param badEmails - Array of bad emails and reasons to ban.
 */
async function banEmails(badEmails: { email: string; reason: string }[]): Promise<void> {
  const uniquePayloads = new Map<string, { [key: string]: string }>();

  for (const b of badEmails) {
    try {
      const emailHash = hashEmail(b.email);
      const displayHash = emailHash.substring(0, LOG_HASH_LENGTH);

      console.log(`Flagging ${b.reason} for hash: ${displayHash}...`);

      uniquePayloads.set(emailHash, {
        [EMAIL_HASH_COLUMN]: emailHash,
        reason: b.reason
      });
    } catch (err) {
      console.error(`API->ZEPTOMAIL_ERROR: Failed to hash email ${b.email}`, err);
    }
  }

  const upsertPayload = Array.from(uniquePayloads.values());
  if (upsertPayload.length === 0) {
    console.info('API->ZEPTOMAIL_INFO: No unique bad emails to ban.');
    return;
  }

  const { error } = await supabaseAdmin.from(BANNED_USERS_TABLE).upsert(
    upsertPayload,
    { onConflict: EMAIL_HASH_COLUMN }
  );

  if (error) {
    console.error("Supabase Bulk Upsert Error:", error);
    throw error;
  }
}

/**
 * Maps bounce events to bad emails array.
 * @param details - Bounce details from ZeptoMail.
 * @param eventName - ZeptoMail event name.
 * @param badEmails - Array to add bad emails to.
 */
function extractBounceEmails(details: BounceDetails[], eventName: string, badEmails: { email: string; reason: string }[]): void {
  for (const detail of details) {
    // FriendDev: First char of email.
    const censoredEmail = detail.bounced_recipient.charAt(0) ?? 'unknown';

    console.log(`Bounce mapped for ${censoredEmail}*** with reason ${detail.reason}`);

    badEmails.push({ email: detail.bounced_recipient, reason: `ZeptoMail ${eventName}` });
  }
}

/**
 * Maps FBL/spam complaint events to bad emails array.
 * @param details - FBL details from ZeptoMail.
 * @param eventName - ZeptoMail event name.
 * @param badEmails - Array to add bad emails to.
 */
function extractFblEmails(details: FblDetails[], eventName: string, badEmails: { email: string; reason: string }[]): void {
  for (const detail of details) {
    console.log(`Complaint mapped for IPs/ReturnPath ${detail.ip} / ${detail.returnPath}`);
    for (const complainer of detail.to) {
      badEmails.push({ email: complainer, reason: `ZeptoMail ${eventName}` });
    }
  }
}

/**
 * Processes a single event data object and extracts bad emails.
 * @param data - The event data to process.
 * @param eventName - ZeptoMail event name.
 * @param badEmails - Array to accumulate bad emails.
 */
function extractBadEmailsFromData(
  data: ZeptoMailWebhookPayload['event_message'][number]['event_data'][number],
  eventName: string,
  badEmails: { email: string; reason: string }[]
): void {
  try {
    if (data.object === ZeptoMailEvents.SoftBounce) {
      console.info('API->ZEPTOMAIL_INFO: Received soft bounce event, ignoring.');
      return;
    }

    if (data.object === ZeptoMailEvents.HardBounce) {
      const parsed = BounceEventDataSchema.safeParse(data);

      if (parsed.success) {
        extractBounceEmails(parsed.data.details, eventName, badEmails);
      } else {
        console.error('API->ZEPTOMAIL_PARSE_ERROR: Malformed bounce event data', parsed.error);
      }
    } else if (data.object === ZeptoMailEvents.FblCompliant) {
      const parsed = FblEventDataSchema.safeParse(data);

      if (parsed.success) {
        extractFblEmails(parsed.data.details, eventName, badEmails);
      } else {
        console.error('API->ZEPTOMAIL_PARSE_ERROR: Malformed FBL event data', parsed.error);
      }
    } else {
      console.warn(`API->ZEPTOMAIL_WARN: Unhandled event data object type: ${data.object}`);
    }
  } catch (err) {
    console.error('API->ZEPTOMAIL_ERROR: Unexpected error extracting bad emails', err);
  }
}

/**
 * Processes the validated ZeptoMail webhook payload, batching all db operations.
 * @param payload - ZeptoMailWebhookPayload to process.
 */
async function processWebhookPayload(payload: ZeptoMailWebhookPayload): Promise<void> {
  const badEmails: { email: string; reason: string }[] = [];

  for (const eventName of payload.event_name) {
    for (const msg of payload.event_message) {
      for (const data of msg.event_data) {
        extractBadEmailsFromData(data, eventName, badEmails);
      }
    }
  }

  if (badEmails.length > 0) {
    await banEmails(badEmails);
  }
}

/**
 * Modular authentication function to verify ZeptoMail webhook signatures safely.
 * @param request - HTTP request.
 * @returns true if authenticated, false otherwise.
 */
function verifyZeptoMailAuth(request: VercelRequest): boolean {
  const secret = process.env.ZEPTO_WEBHOOK_SECRET;
  if (!secret) {
    console.error('API->ZEPTOMAIL_AUTH_ERROR: ZEPTO_WEBHOOK_SECRET is not defined');
    return false;
  }

  const authHeaderRaw = request.headers[ZeptoMailWebhookHeaders.Auth];
  const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

  if (!authHeader) {
    console.error('API->ZEPTOMAIL_AUTH_ERROR: Missing webhook secret header');
    return false;
  }

  const expectedBuffer = Buffer.from(secret);
  const actualBuffer = Buffer.from(authHeader);

  return (expectedBuffer.length === actualBuffer.length) &&
    (crypto.timingSafeEqual(expectedBuffer, actualBuffer));
}

/**
 * Reads the raw request body from an incoming HTTP stream.
 * Required because we disabled Vercel's body parser for HMAC verification.
 * @param request - The incoming HTTP request stream.
 * @returns The raw body as a UTF-8 string.
 */
function readRawBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on('data', (chunk: Buffer) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

/**
 * Verifies the HMAC producer-signature from a ZeptoMail webhook request.
 * @param request - HTTP request.
 * @param rawBody - The raw body string read from the request stream.
 * @returns The raw body string on success (for downstream JSON parsing), or null on failure.
 */
function verifyProducerSignatureFromRequest(request: VercelRequest, rawBody: string): string | null {
  const signatureHeaderRaw = request.headers[ZeptoMailWebhookHeaders.ProducerSignature];
  const signatureHeader = Array.isArray(signatureHeaderRaw) ? signatureHeaderRaw[0] : signatureHeaderRaw;

  if (!signatureHeader) {
    console.error('API->ZEPTOMAIL_SIGNATURE_ERROR: Missing producer-signature header');
    return null;
  }

  let signature;
  try {
    signature = parseProducerSignature(signatureHeader);
  } catch (err) {
    console.error('API->ZEPTOMAIL_SIGNATURE_ERROR: Failed to parse producer-signature header', err);
    return null;
  }

  if (!signature) {
    console.error('API->ZEPTOMAIL_SIGNATURE_ERROR: Malformed producer-signature header');
    return null;
  }

  if (isSignatureExpired(signature.ts)) {
    console.error('API->ZEPTOMAIL_SIGNATURE_ERROR: Signature timestamp expired');
    return null;
  }

  // FriendDev: ZeptoMail sends the body as raw JSON.
  //            The HMAC is computed directly over the raw body string.
  if (!verifyProducerSignature(signature, rawBody)) {
    console.error('API->ZEPTOMAIL_SIGNATURE_ERROR: HMAC signature mismatch');
    return null;
  }

  return rawBody;
}

/**
 * Handle the incoming HTTP request from ZeptoMail webhooks.
 * Uses dual-gate authentication:
 *   Gate 1: Static secret header verification (fast reject).
 *   Gate 2: HMAC producer-signature verification (cryptographic integrity).
 * @param request - HTTP request.
 * @param response - HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    // FriendDev: Log the payload for reference.
    console.log(
      'API->ZEPTOMAIL_WEBOOK::Request->\n',
      JSON.stringify(request.body, null, 2)
    );

    if (request.method !== HttpMethods.Post) {
      return httpMethodNotAllowed(response);
    }

    // FriendDev: Rejects unauthorized traffic before we incur the cost of reading the body stream.
    if (!verifyZeptoMailAuth(request)) {
      return httpForbidden(response, 'Invalid webhook secret');
    }

    // FriendDev: Read the raw body since we disabled Vercel's body parser.
    const rawBody = await readRawBody(request);

    // FriendDev: Cryptographic HMAC signature verification.
    //            Validates payload integrity and protects against replay attacks.
    const dataValue = verifyProducerSignatureFromRequest(request, rawBody);

    if (!dataValue) {
      return httpForbidden(response, 'Invalid producer signature');
    }

    // FriendDev: Parse the extracted JSON payload and validate against our schema.
    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(dataValue);
    } catch {
      console.error('API->ZEPTOMAIL_PARSE_ERROR: Failed to parse webhook JSON payload');
      return httpBadRequest(response, 'Invalid JSON payload');
    }

    const parseResult = ZeptoMailWebhookSchema.safeParse(parsedBody);

    if (!parseResult.success) {
      console.error('API->ZEPTOMAIL_PARSE_ERROR:', parseResult.error);
      return httpBadRequest(response, JSON.stringify(z.treeifyError(parseResult.error)));
    }

    await processWebhookPayload(parseResult.data);

    return httpOk(response);
  } catch (err) {
    console.error('API->ZEPTOMAIL_ERROR:', err);
    return httpInternalServerError(response);
  }
}
