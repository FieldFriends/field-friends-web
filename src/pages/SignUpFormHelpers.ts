import { Affiliation, UNDERGRADUATE_AFFILIATIONS } from '@shared/friendConfig';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';

/**
 * The default offset for the number of neighbor affiliations to include.
 * For example, if the user is a Sophomore, this will include Freshmen and Juniors.
 */
const DEFAULT_AFFILIATION_NEIGHBOR_OFFSET = 1;

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
 * Computes the default minimum matching affiliation based on the target affiliation.
 * @param target - The user's target affiliation.
 * @returns The default minimum affiliation value.
 */
export const computeDefaultMinAffiliation = (target: string): ProfileSubmission['desired_affiliation_min'] | null => {
  if (target === Affiliation.GradsAndPros) {
    return Affiliation.GradsAndPros;
  }

  const index = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(target);

  if (index === -1) {
    return null;
  }

  if (index - DEFAULT_AFFILIATION_NEIGHBOR_OFFSET >= 0) {
    return UNDERGRADUATE_AFFILIATIONS[index - DEFAULT_AFFILIATION_NEIGHBOR_OFFSET] as ProfileSubmission['desired_affiliation_min'];
  }

  return UNDERGRADUATE_AFFILIATIONS[index] as ProfileSubmission['desired_affiliation_min'];
};

/**
 * Computes the default maximum matching affiliation based on the target affiliation.
 * @param target - The user's target affiliation.
 * @returns The default maximum affiliation value.
 */
export const computeDefaultMaxAffiliation = (target: string): ProfileSubmission['desired_affiliation_max'] | null => {
  if (target === Affiliation.GradsAndPros) {
    return Affiliation.GradsAndPros;
  }

  const index = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(target);

  if (index === -1) {
    return null;
  }

  if (index + DEFAULT_AFFILIATION_NEIGHBOR_OFFSET < UNDERGRADUATE_AFFILIATIONS.length) {
    return UNDERGRADUATE_AFFILIATIONS[index + DEFAULT_AFFILIATION_NEIGHBOR_OFFSET] as ProfileSubmission['desired_affiliation_max'];
  }

  return UNDERGRADUATE_AFFILIATIONS[index] as ProfileSubmission['desired_affiliation_max'];
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
