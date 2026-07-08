import { Affiliation, UNDERGRADUATE_AFFILIATIONS, NON_UNDERGRADUATE_AFFILIATIONS, AFFILIATION_OPTIONS, AGE_LIMITS } from '@shared/friendConfig';
import type { FriendFormState } from '@/types/friendFormState';
import {
  type SelectMenuElement,
  createSelectHeader,
  createSelectDivider,
  createSelectOption
} from '@/types/ui';

/**
 * The default offset for the number of neighbor affiliations to include.
 * For example, if the user is a Sophomore, this will include Freshmen and Juniors.
 */
const DEFAULT_UNDERGRAD_NEIGHBOR_OFFSET = 1;

/**
 * The scaling factor for the penalty for being younger than the cutoff age.
 */
const K_MIN = 0.4;

/**
 * The scaling factor for the penalty for being older than the cutoff age.
 */
const K_MAX = 0.4;

/**
 * The default offset for the recommended minimum and maximum ages.
 * For example, if the user is 20, the default minimum age will be 17 and the maximum age will be 23.
 */
const DEFAULT_AGE_OFFSET = 3;

/**
 * The age cutoff for the penalty function.
 * Anyone below or at this age will only get default age values
 * that are +/- DEFAULT_AGE_OFFSET from their actual age.
 * Anyone older than this will have an ever-increasing range.
 */
const CUTOFF_AGE = 25;

/**
 * Computes the default matching affiliations for an undergraduate.
 * @param target - The user's target affiliation.
 * @returns An array of default affiliations.
 */
const computeDefaultUndergradAffiliations = (target: string): string[] => {
  const index = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(target);

  if (index === -1) {
    return [];
  }

  const minIndex = Math.max(0, index - DEFAULT_UNDERGRAD_NEIGHBOR_OFFSET);
  const maxIndex = Math.min(UNDERGRADUATE_AFFILIATIONS.length - 1, index + DEFAULT_UNDERGRAD_NEIGHBOR_OFFSET);

  return UNDERGRADUATE_AFFILIATIONS.slice(minIndex, maxIndex + 1);
};

/**
 * Determines if a given affiliation is an undergraduate affiliation.
 * @param affiliation - The affiliation to check.
 * @returns True if the affiliation is undergraduate, false otherwise.
 */
export const isUndergradAffiliation = (affiliation: string | null | undefined): boolean => {
  if (!affiliation) {
    return false;
  }

  return (UNDERGRADUATE_AFFILIATIONS as readonly string[]).includes(affiliation);
};

/**
 * Calculates the recommended minimum age based on the target age.
 * @param targetAge - The user's actual age.
 * @param minLimit - The absolute minimum allowable age in the system.
 * @returns The calculated default minimum age.
 */
export const computeDefaultMinAge = (targetAge: number, minLimit: number): number => {
  const penalty = Math.max(0, targetAge - CUTOFF_AGE);
  const diff = DEFAULT_AGE_OFFSET + (K_MIN * penalty);
  const value = Math.round(targetAge - diff);

  if (value < minLimit) {
    return minLimit;
  }

  return value;
};

/**
 * Calculates the recommended maximum age based on the target age.
 * @param targetAge - The user's actual age.
 * @param maxLimit - The absolute maximum allowable age in the system.
 * @returns The calculated default maximum age.
 */
export const computeDefaultMaxAge = (targetAge: number, maxLimit: number): number => {
  const penalty = Math.max(0, targetAge - CUTOFF_AGE);
  const diff = DEFAULT_AGE_OFFSET + (K_MAX * penalty);
  const value = Math.round(targetAge + diff);

  if (value > maxLimit) {
    return maxLimit;
  }

  return value;
};

/**
 * Ensures derived age limits are populated with their appropriate defaults
 * only if the root age field exists and the limits themselves are currently missing.
 * @param state - A partial form state object to normalize.
 */
const applyMissingAgeLimits = (state: Partial<FriendFormState>) => {
  if (state.age == null) {
    return;
  }

  if (state.desired_age_min === null) {
    state.desired_age_min = computeDefaultMinAge(state.age, AGE_LIMITS.min);
  }

  if (state.desired_age_max === null) {
    state.desired_age_max = computeDefaultMaxAge(state.age, AGE_LIMITS.max);
  }
};

/**
 * Ensures derived affiliation limits are populated with their appropriate defaults
 * only if the root affiliation field exists and the limits themselves are currently missing.
 * @param state - A partial form state object to normalize.
 */
const applyMissingAffiliations = (state: Partial<FriendFormState>) => {
  const { affiliation } = state;

  if (!affiliation) {
    return;
  }

  if (state.desired_affiliations && state.desired_affiliations.length > 0) {
    return;
  }

  if (isUndergradAffiliation(affiliation)) {
    state.desired_affiliations = computeDefaultUndergradAffiliations(affiliation);
    return;
  }

  if (affiliation === Affiliation.Graduate) {
    state.desired_affiliations = [Affiliation.Graduate, Affiliation.Staff, Affiliation.Alum];
  } else if (affiliation === Affiliation.Staff) {
    state.desired_affiliations = [Affiliation.Graduate, Affiliation.Staff, Affiliation.Faculty, Affiliation.Alum];
  } else if (affiliation === Affiliation.Faculty) {
    state.desired_affiliations = [Affiliation.Faculty, Affiliation.Staff, Affiliation.Alum];
  } else if (affiliation === Affiliation.Alum) {
    state.desired_affiliations = [Affiliation.Graduate, Affiliation.Staff, Affiliation.Faculty, Affiliation.Alum];
  }
};

/**
 * Ensures derived or dependent form fields are populated with their appropriate defaults
 * only if their parent fields exist and the dependent fields themselves are currently missing.
 * @param state - A partial form state object to normalize.
 */
export const applyMissingDerivedFields = (state: Partial<FriendFormState>) => {
  applyMissingAgeLimits(state);
  applyMissingAffiliations(state);
};

/**
 * Dynamically generates a grouped list of affiliation options for a Select component.
 * It uses strict typing to avoid magic strings for separators.
 */
export const generateAffiliationSelectItems = (): SelectMenuElement[] => {
  const items: SelectMenuElement[] = [];

  items.push(createSelectHeader('Undergraduates'));

  for (const affil of UNDERGRADUATE_AFFILIATIONS) {
    const option = AFFILIATION_OPTIONS.find(opt => opt.value === affil);
    if (option) {
      items.push(createSelectOption(option.label, option.value));
    }
  }

  items.push(createSelectDivider());
  items.push(createSelectHeader('Non-undergraduates'));

  for (const affil of NON_UNDERGRADUATE_AFFILIATIONS) {
    const option = AFFILIATION_OPTIONS.find(opt => opt.value === affil);
    if (option) {
      items.push(createSelectOption(option.label, option.value));
    }
  }

  return items;
};
