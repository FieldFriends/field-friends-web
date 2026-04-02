import { z } from "zod";

export const UnsubscribeRequestSchema = z.object({
  /**
   * JWT token containing the user ID and action.
   */
  token: z.jwt(),
}).strict();

export type UnsubscribeRequest = z.infer<typeof UnsubscribeRequestSchema>;