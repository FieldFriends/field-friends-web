import { z } from 'zod';
import {
  AGE_LIMITS,
  AFFILIATION_VALUES,
  GENDER_VALUES,
  SOCIAL_ENERGY_VALUES,
  EMAIL_REGEX,
  MAX_BLOCKED_EMAILS,
  FIELD_MIN_FREETEXT_CHARS,
  FIELD_MAX_FREETEXT_CHARS,
  Affiliation,
  UNDERGRADUATE_AFFILIATIONS,
  NON_UNDERGRADUATE_AFFILIATIONS
} from '../friendConfig.js';
import { isSelfEmail } from '../utils/emailUtils.js';

const ProfileSchemaBase = z.object({
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

  desired_affiliations: z.array(z.enum(AFFILIATION_VALUES))
    .min(1, { message: 'You must select at least one match' }),

}).strict();

type ProfileSubmissionBase = z.infer<typeof ProfileSchemaBase>;

export const PROFILE_VALIDATION_MESSAGES = {
  AGE_MIN_GREATER_THAN_MAX: 'Minimum age must be less than or equal to maximum age.',
  AGE_MAX_LESS_THAN_MIN: 'Maximum age must be greater than or equal to minimum age.',
  AGE_MIN_GREATER_THAN_OWN: 'Minimum acceptable age cannot be greater than your own age.',
  AGE_MAX_LESS_THAN_OWN: 'Maximum acceptable age cannot be less than your own age.',
  SELF_INCLUSION: 'You must be willing to match with your own affiliation.',
  UNDERGRAD_EXCLUSION: 'Undergraduates can only match with other undergraduates.',
  UNDERGRAD_CONTINUITY: 'Undergraduate matches must be a continuous range of class years.',
  NON_UNDERGRAD_EXCLUSION: 'Graduate students, staff, and faculty cannot match with undergraduates.',
  GRAD_FACULTY_RESTRICTION: 'Graduate students cannot match with faculty.',
  FACULTY_GRAD_RESTRICTION: 'Faculty cannot match with graduate students.',
  BLOCK_OWN_EMAIL: 'You cannot block your own email.'
} as const;

/**
 * Validates age limits.
 * @param val - The form values.
 * @param ctx - The Zod refinement context.
 */
const validateAgeLimits = (val: ProfileSubmissionBase, ctx: z.RefinementCtx) => {
  if (val.desired_age_min > val.desired_age_max) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.AGE_MIN_GREATER_THAN_MAX,
      path: ['desired_age_min' satisfies keyof ProfileSubmissionBase]
    });
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.AGE_MAX_LESS_THAN_MIN,
      path: ['desired_age_max' satisfies keyof ProfileSubmissionBase]
    });
  }

  if (val.desired_age_min > val.age) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.AGE_MIN_GREATER_THAN_OWN,
      path: ['desired_age_min' satisfies keyof ProfileSubmissionBase]
    });
  }

  if (val.desired_age_max < val.age) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.AGE_MAX_LESS_THAN_OWN,
      path: ['desired_age_max' satisfies keyof ProfileSubmissionBase]
    });
  }
};

/**
 * Validates that the user's own affiliation is included in their desired matches.
 * @param val - The form values.
 * @param ctx - The Zod refinement context.
 */
const validateSelfInclusion = (val: ProfileSubmissionBase, ctx: z.RefinementCtx) => {
  if (!val.desired_affiliations.includes(val.affiliation)) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.SELF_INCLUSION,
      path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
    });
  }
};

/**
 * Validates that undergraduate matches are continuous and exclusive.
 * @param val - The form values.
 * @param ctx - The Zod refinement context.
 */
const validateUndergradContinuity = (val: ProfileSubmissionBase, ctx: z.RefinementCtx) => {
  const isUndergrad = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).includes(val.affiliation);

  if (!isUndergrad) {
    return;
  }

  // FriendDev: Undergrads can only match with other undergrads.
  const hasNonUndergrad = val.desired_affiliations.some((affil) =>
    (NON_UNDERGRADUATE_AFFILIATIONS as readonly string[]).includes(affil)
  );

  if (hasNonUndergrad) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.UNDERGRAD_EXCLUSION,
      path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
    });
    return;
  }

  // FriendDev: Check continuity using index positions.
  const indices = val.desired_affiliations
    .map((affil) => (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(affil))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b);

  if (indices.length > 0) {
    const minIndex = indices[0] ?? 0;
    const maxIndex = indices.at(-1) ?? 0;

    if (maxIndex - minIndex + 1 !== indices.length) {
      ctx.addIssue({
        code: "custom",
        message: PROFILE_VALIDATION_MESSAGES.UNDERGRAD_CONTINUITY,
        path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
      });
    }
  }
};

/**
 * Validates that non-undergraduate matches follow exclusive constraints.
 * @param val - The form values.
 * @param ctx - The Zod refinement context.
 */
const validateNonUndergradExclusions = (val: ProfileSubmissionBase, ctx: z.RefinementCtx) => {
  const isNonUndergrad = (NON_UNDERGRADUATE_AFFILIATIONS as readonly string[]).includes(val.affiliation);

  if (!isNonUndergrad) {
    return;
  }

  // FriendDev: Non-undergrads can't match with undergrads.
  const hasUndergrad = val.desired_affiliations.some((affil) =>
    (UNDERGRADUATE_AFFILIATIONS as readonly string[]).includes(affil)
  );

  if (hasUndergrad) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.NON_UNDERGRAD_EXCLUSION,
      path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
    });
  }

  // FriendDev: Role-specific restrictions.
  if (val.affiliation === Affiliation.Graduate && val.desired_affiliations.includes(Affiliation.Faculty)) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.GRAD_FACULTY_RESTRICTION,
      path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
    });
  }

  if (val.affiliation === Affiliation.Faculty && val.desired_affiliations.includes(Affiliation.Graduate)) {
    ctx.addIssue({
      code: "custom",
      message: PROFILE_VALIDATION_MESSAGES.FACULTY_GRAD_RESTRICTION,
      path: ['desired_affiliations' satisfies keyof ProfileSubmissionBase]
    });
  }
};

export const ProfileSchema = ProfileSchemaBase.superRefine((val, ctx) => {
  validateAgeLimits(val, ctx);
  validateSelfInclusion(val, ctx);
  validateUndergradContinuity(val, ctx);
  validateNonUndergradExclusions(val, ctx);
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

  // FriendDev: We use .superRefine instead of .extend because ProfileSchema is already a ZodEffects.
  return ProfileSchema.superRefine((val, ctx) => {
    val.blocked_emails.forEach((email, index) => {
      if (isSelfEmail(email, userEmail)) {
        ctx.addIssue({
          code: "custom",
          message: PROFILE_VALIDATION_MESSAGES.BLOCK_OWN_EMAIL,
          path: ['blocked_emails' satisfies keyof ProfileSubmissionBase, index]
        });
      }
    });
  });
};