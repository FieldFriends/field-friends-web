import { describe, it, expect } from 'vitest';
import { ProfileSchema, createProfileSchema, PROFILE_VALIDATION_MESSAGES } from '../profileSchema';
import { Affiliation } from '../../friendConfig';

describe('ProfileSchema', () => {
  const getValidBaseData = () => ({
    name: 'John Doe',
    age: 20,
    gender: 'Male',
    social_energy: 'Medium',
    interests: 'I like rock climbing and hiking.',
    activities: 'I like going on long walks and climbing rocks.',
    introduction: 'Hi, I\'m John!',
    blocked_emails: [] as string[],
    desired_age_min: 19,
    desired_age_max: 21,
    affiliation: Affiliation.Sophomore as string,
    desired_affiliations: [Affiliation.Freshman, Affiliation.Sophomore, Affiliation.Junior] as string[],
  });

  describe('Self-Inclusion', () => {
    it('should fail if desired_affiliations does not include own affiliation', () => {
      const data = getValidBaseData();
      // FriendDev: Missing own affiliation (sophomore).
      data.desired_affiliations = [Affiliation.Junior, Affiliation.Senior];

      const result = ProfileSchema.safeParse(data);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.SELF_INCLUSION)).toBe(true);
      }
    });

    it('should pass if desired_affiliations includes own affiliation', () => {
      const data = getValidBaseData();
      const result = ProfileSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe('Undergrad Isolation & Continuity', () => {
    it('should fail if undergrad tries to match with non-undergrad', () => {
      const data = getValidBaseData();
      data.desired_affiliations = [Affiliation.Sophomore, Affiliation.Graduate];

      const result = ProfileSchema.safeParse(data);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.UNDERGRAD_EXCLUSION)).toBe(true);
      }
    });

    it('should fail if undergrad matches are not contiguous', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Freshman;

      // FriendDev: Missing sophomore.
      data.desired_affiliations = [Affiliation.Freshman, Affiliation.Junior];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.UNDERGRAD_CONTINUITY)).toBe(true);
      }
    });
  });

  describe('Non-Undergrad Isolation & Constraints', () => {
    it('should fail if non-undergrad tries to match with undergrad', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Graduate;

      data.desired_affiliations = [Affiliation.Graduate, Affiliation.Senior];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.NON_UNDERGRAD_EXCLUSION)).toBe(true);
      }
    });

    it('should fail if grad tries to match with faculty', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Graduate;

      data.desired_affiliations = [Affiliation.Graduate, Affiliation.Faculty];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.GRAD_FACULTY_RESTRICTION)).toBe(true);
      }
    });

    it('should pass if grad tries to match with staff', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Graduate;

      data.desired_affiliations = [Affiliation.Graduate, Affiliation.Staff];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if faculty tries to match with grads', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Faculty;

      data.desired_affiliations = [Affiliation.Faculty, Affiliation.Graduate];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.FACULTY_GRAD_RESTRICTION)).toBe(true);
      }
    });

    it('should pass if alum tries to match with grads, staff, and faculty', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Alum;
      data.desired_affiliations = [Affiliation.Alum, Affiliation.Graduate, Affiliation.Staff, Affiliation.Faculty];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if alum tries to match with undergrads', () => {
      const data = getValidBaseData();
      data.affiliation = Affiliation.Alum;
      data.desired_affiliations = [Affiliation.Alum, Affiliation.Senior];

      const result = ProfileSchema.safeParse(data);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.NON_UNDERGRAD_EXCLUSION)).toBe(true);
      }
    });
  });

  describe('createProfileSchema', () => {
    it('should prevent blocking own email', () => {
      const data = getValidBaseData();
      data.blocked_emails = ['test@illinois.edu'];

      const schema = createProfileSchema('test@illinois.edu');
      const result = schema.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === PROFILE_VALIDATION_MESSAGES.BLOCK_OWN_EMAIL)).toBe(true);
      }
    });
  });
});
