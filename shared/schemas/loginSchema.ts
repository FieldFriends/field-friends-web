import { EMAIL_REGEX } from '../friendConfig.js';
import z from "zod";

export const LoginSchema = z.object({
  email: z.email({ pattern: EMAIL_REGEX }),
  turnstileToken: z.string().min(1)
}).strict();

export type LoginRequest = z.infer<typeof LoginSchema>;