import { z } from 'zod';
import {
  AGE_LIMITS,
  AFFILIATION_VALUES,
  GENDER_VALUES,
  SOCIAL_ENERGY_VALUES
} from '@/config/FriendConfig';

export const ProfileSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Preferred name is required' })
    .max(50, { message: 'Name must be 50 characters or fewer' }),

  age: z.coerce.number()
    .int()
    .min(AGE_LIMITS.min, { message: `Must be at least ${AGE_LIMITS.min}` })
    .max(AGE_LIMITS.max, { message: `Must be under ${AGE_LIMITS.max}` }),

  gender: z.enum(GENDER_VALUES, {
    error: () => ({ message: 'Gender identity is required' })
  }),

  affiliation: z.enum(AFFILIATION_VALUES, {
    error: () => ({ message: 'University affiliation is required' })
  }),

  social_energy: z.enum(SOCIAL_ENERGY_VALUES, {
    error: () => ({ message: 'Selection is required' })
  }),

  interests: z.string()
    .trim()
    .min(10, { message: 'Must be at least 10 characters' })
    .max(1200, { message: 'Response must be 1200 characters or fewer' }),

  activities: z.string()
    .trim()
    .min(10, { message: 'Must be at least 10 characters' })
    .max(1200, { message: 'Response must be 1200 characters or fewer' }),

  introduction: z.string().optional(),
});

export type ProfileSubmission = z.infer<typeof ProfileSchema>;