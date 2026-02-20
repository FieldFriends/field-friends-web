import { EMAIL_REGEX } from "#shared/friendConfig";
import z from "zod";

export const LoginSchema = z.object({
  email: z.email({ pattern: EMAIL_REGEX })
}).strict();

export type LoginRequest = z.infer<typeof LoginSchema>;