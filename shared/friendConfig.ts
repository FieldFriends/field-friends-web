export const FIELD_MIN_FREETEXT_CHARS = 10;
export const FIELD_MAX_FREETEXT_CHARS = 1200;

export const MAX_BLOCKED_EMAILS = 10;

export const AGE_LIMITS = {
  min: 18,
  max: 65,
} as const;

// FriendDev: some_email@illinois.edu
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@illinois\.edu$/i;

export const Affiliation = {
  Freshman: 'Freshman',
  Sophomore: 'Sophomore',
  Junior: 'Junior',
  Senior: 'Senior',
  Graduate: 'Graduate',
  Staff: 'Staff',
  Faculty: 'Faculty',
} as const;

export type AffiliationValue = typeof Affiliation[keyof typeof Affiliation];

export const AFFILIATION_OPTIONS = [
  { label: 'Freshman', value: Affiliation.Freshman },
  { label: 'Sophomore', value: Affiliation.Sophomore },
  { label: 'Junior', value: Affiliation.Junior },
  { label: 'Senior', value: Affiliation.Senior },
  { label: 'Graduate Student', value: Affiliation.Graduate },
  { label: 'Staff', value: Affiliation.Staff },
  { label: 'Faculty', value: Affiliation.Faculty },
] as const;

export const UNDERGRADUATE_AFFILIATIONS = [
  Affiliation.Freshman,
  Affiliation.Sophomore,
  Affiliation.Junior,
  Affiliation.Senior,
] as const;

export const NON_UNDERGRADUATE_AFFILIATIONS = [
  Affiliation.Graduate,
  Affiliation.Staff,
  Affiliation.Faculty,
] as const;

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Non-binary', value: 'Nonbinary' },
  { label: 'Other', value: 'Other' },
  { label: 'Prefer not to say', value: 'Unspecified' },
] as const;

export const SOCIAL_ENERGY_OPTIONS = [
  {
    label: "Doing things alone, like gaming, reading, cooking, etc.",
    value: 'Low'
  },
  {
    label: "Hanging out with a small group of friends",
    value: 'Medium'
  },
  {
    label: "Doing things with larger groups in more lively environments",
    value: 'High'
  },
  {
    label: "Going to parties and meeting new people",
    value: 'Energetic'
  },
] as const;


export const AFFILIATION_VALUES = Object.values(Affiliation) as [string, ...string[]];
export const GENDER_VALUES = GENDER_OPTIONS.map(o => o.value) as [string, ...string[]];
export const SOCIAL_ENERGY_VALUES = SOCIAL_ENERGY_OPTIONS.map(o => o.value) as [string, ...string[]];