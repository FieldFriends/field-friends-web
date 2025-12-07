export const AGE_LIMITS = {
  min: 18,
  max: 29,
} as const;

export const AFFILIATION_OPTIONS = [
  { label: 'Underclassman (Freshman or Sophomore)', value: 'Underclassman' },
  { label: 'Upperclassman (Junior or Senior)', value: 'Upperclassman' },
  { label: 'Graduate & Professional (Masters, PhD, Staff)', value: 'GradsAndPros' },
] as const;

export const GENDER_OPTIONS = [
  { label: 'Man', value: 'M' },
  { label: 'Woman', value: 'W' },
  { label: 'Non-Binary', value: 'NB' },

  // FriendDev: "U" for "Unknown"
  { label: 'Prefer not to say', value: 'U' },
] as const;

export const AFFILIATION_VALUES = AFFILIATION_OPTIONS.map(o => o.value) as [string, ...string[]];
export const GENDER_VALUES = GENDER_OPTIONS.map(o => o.value) as [string, ...string[]];