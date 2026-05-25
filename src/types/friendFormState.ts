import type { ProfileSubmission } from '../../shared/schemas/profileSchema';

export interface FriendFormState {
  name: string;
  age: number | null;
  desired_age_min: number | null;
  desired_age_max: number | null;
  gender: ProfileSubmission['gender'] | null;
  affiliation: ProfileSubmission['affiliation'] | null;
  social_energy: ProfileSubmission['social_energy'] | null;
  interests: string;
  activities: string;
  introduction: string;
  blocked_emails: string[];
}

/**
 * Empty form state used by both form initialization and the dirty-check composable.
 */
export const INITIAL_FORM_STATE: Readonly<FriendFormState> = Object.freeze({
  name: '',
  age: null,
  desired_age_min: null,
  desired_age_max: null,
  gender: null,
  affiliation: null,
  social_energy: null,
  interests: '',
  activities: '',
  introduction: '',
  blocked_emails: [],
});