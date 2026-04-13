import { z } from 'zod';
import {
  AGE_LIMITS,
  AFFILIATION_VALUES,
  GENDER_VALUES,
  SOCIAL_ENERGY_VALUES
} from '../friendConfig.js';

export const AccountDataResponseSchema = z.object({
  gender: z.enum(GENDER_VALUES),
  age: z.number().int().min(AGE_LIMITS.min).max(AGE_LIMITS.max),
  affiliation: z.enum(AFFILIATION_VALUES),
  social_energy: z.enum(SOCIAL_ENERGY_VALUES),
  submitted_at: z.coerce.date(),
}).strict();

export type AccountDataResponse = z.infer<typeof AccountDataResponseSchema>;
