import { z } from 'zod';

export const ZeptoMailWebhookHeaders = {
  Auth: 'x-zepto-secret',
  ProducerSignature: 'producer-signature',
} as const;

export const ZeptoMailEvents = {
  SoftBounce: 'softbounce',
  HardBounce: 'hardbounce',
  FblCompliant: 'fbl_compliant',
} as const;

export const ZeptoMailEventValues = [
  ZeptoMailEvents.SoftBounce,
  ZeptoMailEvents.HardBounce,
  ZeptoMailEvents.FblCompliant,
] as const;

export type ZeptoMailEvent = typeof ZeptoMailEventValues[number];

const EmailAddressSchema = z.object({
  address: z.email(),
  name: z.string().optional(),
}).strict();

const EmailInfoSchema = z.object({
  cc: z.array(z.object({ email_address: EmailAddressSchema }).strict()).optional(),
  client_reference: z.string().optional(),
  bcc: z.array(z.object({ email_address: EmailAddressSchema }).strict()).optional(),
  is_smtp_trigger: z.boolean(),
  subject: z.string().optional(),
  bounce_address: z.string().optional(),
  is_synced: z.boolean().optional(),
  email_reference: z.string(),
  reply_to: z.array(EmailAddressSchema).optional(),
  from: EmailAddressSchema,
  to: z.array(z.object({ email_address: EmailAddressSchema }).strict()),
  tag: z.string().optional(),
  processed_time: z.string(),
  object: z.literal('email'),
}).strict();

const BounceDetailsSchema = z.object({
  reason: z.string(),
  bounced_recipient: z.email(),
  time: z.string(),
  diagnostic_message: z.string().optional(),
}).strict();

export const BounceEventDataSchema = z.object({
  details: z.array(BounceDetailsSchema),
  object: z.enum([ZeptoMailEvents.SoftBounce, ZeptoMailEvents.HardBounce]),
}).strict();

export const FblDetailsSchema = z.object({
  fblFrom: z.string(),
  returnPath: z.string(),
  ip: z.string(),
  from: z.string(),
  to: z.array(z.string()),
}).strict();

export const FblEventDataSchema = z.object({
  details: z.array(FblDetailsSchema),
  object: z.literal(ZeptoMailEvents.FblCompliant),
}).strict();

const EventDataSchema = z.object({
  object: z.string(),
}).loose();

const EventMessageSchema = z.object({
  email_info: EmailInfoSchema,
  event_data: z.array(EventDataSchema),
  request_id: z.string(),
}).loose();

export const ZeptoMailWebhookSchema = z.object({
  event_name: z.array(z.string()),
  event_message: z.array(EventMessageSchema),
  mailagent_key: z.string(),
  webhook_request_id: z.string(),
}).loose();

export const ProducerSignatureSchema = z.object({
  /**
   * Timestamp (ms) when the webhook was initiated from ZeptoMail's server.
   */
  ts: z.number(),

  /**
   * The HMAC signature (Base64-encoded).
   */
  s: z.string(),

  /**
   * The signing algorithm identifier (e.g. "HmacSHA256").
   */
  sAlgorithm: z.string(),
}).strict();


export type ZeptoMailWebhookPayload = z.infer<typeof ZeptoMailWebhookSchema>;
export type BounceDetails = z.infer<typeof BounceDetailsSchema>;
export type FblDetails = z.infer<typeof FblDetailsSchema>;
export type BounceEventData = z.infer<typeof BounceEventDataSchema>;
export type FblEventData = z.infer<typeof FblEventDataSchema>;
export type ProducerSignature = z.infer<typeof ProducerSignatureSchema>;
