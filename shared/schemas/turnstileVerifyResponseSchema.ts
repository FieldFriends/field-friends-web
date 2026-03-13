import z from "zod";

export const TurnstileVerifyResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  cdata: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export type TurnstileVerifyResponse = z.infer<typeof TurnstileVerifyResponseSchema>;