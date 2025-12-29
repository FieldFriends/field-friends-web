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
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'W' },
  { label: 'Non-binary', value: 'NB' },
  { label: 'Other', value: 'O' },

  // FriendDev: "U" for "Unknown"
  { label: 'Prefer not to say', value: 'U' },
] as const;

export const GROUP_ROLE_OPTIONS = [
  {
    label: "I'm usually the one making the plans",
    value: 'Planner'
  },
  {
    label: "I suggest the wild ideas",
    value: 'Instigator'
  },
  {
    label: "I make sure everyone's having a good time",
    value: 'Glue'
  },
  {
    label: "Drop a pin I'll pull up",
    value: 'Adventurous'
  },
  {
    label: "I'm just happy to be there :)",
    value: 'Friend'
  },
] as const;

export const SOCIAL_ENERGY_OPTIONS = [
  {
    label: "Doing things alone, like gaming, reading, cooking, etc.",
    value: 'Low'
  },
  {
    label: "Gettin' a few friends together and hanging out",
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
export const GROUP_ROLE_VALUES = GROUP_ROLE_OPTIONS.map(o => o.value) as [string, ...string[]];
export const SOCIAL_ENERGY_VALUES = SOCIAL_ENERGY_OPTIONS.map(o => o.value) as [string, ...string[]];