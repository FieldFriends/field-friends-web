import { z } from 'zod';

/**
 * This file lives in api/_utils/ because the backend admin client
 * also needs the VITE_SUPABASE_URL. The frontend uses import.meta.env
 * directly in src/services/supabase.ts instead.
 * import.meta.env is not available in the api/_utils/ directory.
 * This file cannot be imported from src/ directory.
 */

/**
 * Strict Zod schema for public environment vars.
 * Safe for frontend and backend.
 */
const PublicEnvSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
}).strip();

export type PublicEnv = z.infer<typeof PublicEnvSchema>;

const result = PublicEnvSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`CRITICAL: Public environment validation failed:\n${result.error.message}`);
}

/**
 * Validated and strongly-typed public environment variables.
 */
export const PUBLIC_ENV = result.data;
