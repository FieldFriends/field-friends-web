import { z } from 'zod';

export const appStateEnum = z.enum(['open', 'closed', 'paused', 'scheduled']);

export const appStateResponseSchema = z.object({
  currentState: appStateEnum,
  roundStart: z.string().nullable(),
  roundEnd: z.string().nullable(),
});

export type AppState = z.infer<typeof appStateEnum>;
export type AppStateResponse = z.infer<typeof appStateResponseSchema>;