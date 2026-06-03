import { z } from 'zod';

export enum AppState {
  Open = 'open',
  Closed = 'closed',
  Paused = 'paused',
  Scheduled = 'scheduled'
}

export const AppStateResponseSchema = z.object({
  currentState: z.enum(AppState),
  roundStart: z.string().nullable(),
  roundEnd: z.string().nullable(),
}).strict();

export type AppStateResponse = z.infer<typeof AppStateResponseSchema>;