import { z } from 'zod';
import {
  AGE_LIMITS,
  AFFILIATION_VALUES,
  GENDER_VALUES,
  SOCIAL_ENERGY_VALUES
} from '@/config/FriendConfig';

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(50),

  age: z.coerce.number()
    .int()
    .min(AGE_LIMITS.min, { message: `Must be at least ${AGE_LIMITS.min}` })
    .max(AGE_LIMITS.max, { message: `Must be under ${AGE_LIMITS.max}` }),

  gender: z.enum(GENDER_VALUES, {
    message: 'Please select a gender option'
  }),

  affiliation: z.enum(AFFILIATION_VALUES, {
    message: 'Please select your affiliation'
  }),

  social_energy: z.enum(SOCIAL_ENERGY_VALUES, {
    message: 'Please select how you recharge'
  }),

  interests: z.string().min(10, { message: 'Please write a bit more about your interests.' }),

  activities: z.string().min(10, { message: 'Please write a bit more.' }),

  introduction: z.string().optional(),
});

export type ProfileSubmission = z.infer<typeof ProfileSchema>;