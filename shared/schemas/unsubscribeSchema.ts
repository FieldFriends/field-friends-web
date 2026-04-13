import { UnsubscribeConstants } from '../constants.js';
import { z } from 'zod';

export const UnsubscribeSchema = z.object({
  /**
   * User ID. "Sub" for "subject" is standard JWT claim.
   */
  sub: z.uuid(),

  /**
   * Action to perform. Hardcoded to 'unsubscribe' to prevent other actions from being performed.
   */
  action: z.literal(UnsubscribeConstants.Action),

  /**
   * Issued at timestamp.
   */
  iat: z.number(),

  /**
   * Expiration timestamp.
   */
  exp: z.number(),
}).strict();

export type UnsubscribeTokenPayload = z.infer<typeof UnsubscribeSchema>;