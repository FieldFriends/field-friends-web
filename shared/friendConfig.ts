export const FIELD_MIN_FREETEXT_CHARS = 10;
export const FIELD_MAX_FREETEXT_CHARS = 1200;

export const MAX_BLOCKED_EMAILS = 10;

export const AGE_LIMITS = {
  min: 18,
  max: 29,
} as const;

// FriendDev: some_email@illinois.edu
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@illinois\.edu$/i;

export const AFFILIATION_OPTIONS = [
  { label: 'Underclassman (Freshman or Sophomore)', value: 'Underclassman' },
  { label: 'Upperclassman (Junior or Senior)', value: 'Upperclassman' },
  { label: 'Graduate & Professional (Masters, Ph.D, Staff)', value: 'GradsAndPros' },
] as const;

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Non-binary', value: 'Nonbinary' },
  { label: 'Other', value: 'Other' },

  // FriendDev: "U" for "Unknown"
  { label: 'Prefer not to say', value: 'Unknown' },
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


export const AFFILIATION_VALUES = AFFILIATION_OPTIONS.map(o => o.value) as [string, ...string[]];
export const GENDER_VALUES = GENDER_OPTIONS.map(o => o.value) as [string, ...string[]];
export const SOCIAL_ENERGY_VALUES = SOCIAL_ENERGY_OPTIONS.map(o => o.value) as [string, ...string[]];