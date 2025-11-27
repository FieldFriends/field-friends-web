export const FriendRules = {
  required: (v: any) => !!v || 'Field is required',
  email: (v: string) => {
    // FriendDev: Allow required rule to win first, then check for @illinois.edu.
    return !v || /^[A-Za-z0-9._%+-]+@illinois\.edu$/i.test(v) || 'Must enter @illinois.edu email';
  }
};