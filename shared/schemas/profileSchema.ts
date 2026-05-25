import { z } from 'zod';
import {
  AGE_LIMITS,
  AFFILIATION_VALUES,
  GENDER_VALUES,
  SOCIAL_ENERGY_VALUES,
  EMAIL_REGEX,
  MAX_BLOCKED_EMAILS,
  FIELD_MIN_FREETEXT_CHARS,
  FIELD_MAX_FREETEXT_CHARS
} from '../friendConfig.js';
import { isSelfEmail } from '../utils/emailUtils.js';

export const ProfileSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Name is required' })
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
    .min(FIELD_MIN_FREETEXT_CHARS, { message: `Must be at least ${FIELD_MIN_FREETEXT_CHARS} characters` })
    .max(FIELD_MAX_FREETEXT_CHARS, { message: `Response must be ${FIELD_MAX_FREETEXT_CHARS} characters or fewer` }),

  activities: z.string()
    .trim()
    .min(FIELD_MIN_FREETEXT_CHARS, { message: `Must be at least ${FIELD_MIN_FREETEXT_CHARS} characters` })
    .max(FIELD_MAX_FREETEXT_CHARS, { message: `Response must be ${FIELD_MAX_FREETEXT_CHARS} characters or fewer` }),

  introduction: z.string()
    .trim()
    .max(FIELD_MAX_FREETEXT_CHARS, { message: `Response must be ${FIELD_MAX_FREETEXT_CHARS} characters or fewer` })
    .optional()
    // FriendDev: Allow empty string OR min length 10.
    .refine((val) => !val || val.length >= FIELD_MIN_FREETEXT_CHARS, {
      message: `Must be at least ${FIELD_MIN_FREETEXT_CHARS} characters if provided`
    }),

  blocked_emails: z.array(
    z.string()
      .trim()
      .toLowerCase()
      .regex(EMAIL_REGEX, { message: 'Must be a valid @illinois.edu email' })
  )
    .max(MAX_BLOCKED_EMAILS, { message: `You can only block up to ${MAX_BLOCKED_EMAILS} emails` })
    .default([]),

  desired_age_min: z.coerce.number()
    .int()
    .min(AGE_LIMITS.min, { message: `Must be at least ${AGE_LIMITS.min}` })
    .max(AGE_LIMITS.max, { message: `Must be under ${AGE_LIMITS.max}` }),

  desired_age_max: z.coerce.number()
    .int()
    .min(AGE_LIMITS.min, { message: `Must be at least ${AGE_LIMITS.min}` })
    .max(AGE_LIMITS.max, { message: `Must be under ${AGE_LIMITS.max}` }),

}).strict().superRefine((val, ctx) => {
  if (val.desired_age_min > val.desired_age_max) {
    ctx.addIssue({
      code: "custom",
      message: 'Minimum age must be less than or equal to maximum age',
      path: ['desired_age_min']
    });
    ctx.addIssue({
      code: "custom",
      message: 'Maximum age must be greater than or equal to minimum age',
      path: ['desired_age_max']
    });
  }

  if (val.desired_age_min > val.age) {
    ctx.addIssue({
      code: "custom",
      message: 'Minimum acceptable age cannot be greater than your own age',
      path: ['desired_age_min']
    });
  }

  if (val.desired_age_max < val.age) {
    ctx.addIssue({
      code: "custom",
      message: 'Maximum acceptable age cannot be less than your own age',
      path: ['desired_age_max']
    });
  }
});

export type ProfileSubmission = z.infer<typeof ProfileSchema>;

/**
 * Creates a context-aware ProfileSchema that prevents users from blocking their own email.
 *
 * @param userEmail - The email address of the current user.
 * @returns A Zod schema extending ProfileSchema with context-aware validation.
 */
export const createProfileSchema = (userEmail?: string | null) => {
  if (!userEmail) {
    return ProfileSchema;
  }

  return ProfileSchema.extend({
    blocked_emails: ProfileSchema.shape.blocked_emails.superRefine((emails, ctx) => {
      emails.forEach((email, index) => {
        if (isSelfEmail(email, userEmail)) {
          ctx.addIssue({
            code: "custom",
            message: 'You cannot block your own email',
            path: [index]
          });
        }
      });
    })
  });
};