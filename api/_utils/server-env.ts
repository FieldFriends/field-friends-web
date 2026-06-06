import { z } from 'zod';

// FriendDev: Ensure this can never be imported on the frontend.
if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
  throw new TypeError('CRITICAL: Server environment variables imported on the client!');
}

/**
 * Strict Zod schema for all backend-only environment variables.
 * Never expose or import these on the frontend.
 */
const ServerEnvSchema = z.object({
  USER_HASH_PEPPER: z.string().min(64),
  HASH_PEPPER: z.string().min(64),
  FIELD_FRIENDS_PUBLIC_KEY: z.string().min(1),
  FIELD_FRIENDS_MLKEM_PUBLIC_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  ZEPTO_WEBHOOK_SECRET: z.string().min(64),
  ZEPTO_AUTH_KEY: z.string().min(1),
  // TODO @FriendDev: ADD THIS TO ENV
  // You can find the Transaction Pooler connection string in your Supabase Dashboard:
  // Settings -> Database -> Connection string -> Nodejs
  SUPABASE_DATABASE_URL: z.string().min(1),
}).strip();

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

const result = ServerEnvSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`CRITICAL: Server environment validation failed:\n${result.error.message}`);
}

/**
 * Validated and backend-only environment vars.
 */
export const SERVER_ENV = result.data;
