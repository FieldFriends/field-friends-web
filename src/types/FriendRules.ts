import { AGE_LIMITS, EMAIL_REGEX } from '@/config/FriendConfig';

export const FriendRules = {
  required: (v: any) => !!v || 'Field is required',

  email: (v: string) => {
    return !v || EMAIL_REGEX.test(v) || 'Must be a valid @illinois.edu email';
  },

  age: (v: number | string) => {
    if (!v) {
      return true;
    }

    const val = Number(v);

    if (val < AGE_LIMITS.min) {
      return `Must be at least ${AGE_LIMITS.min}`;
    }

    if (val > AGE_LIMITS.max) {
      return `Must be under ${AGE_LIMITS.max}`;
    }

    return true;
  }
};