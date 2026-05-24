/**
 * Checks whether the inputted email is the same as the user's current email.
 *
 * @param email - The email input value.
 * @param userEmail - The user's current email.
 * @returns True if it matches the user's email, false otherwise.
 */
export const isSelfEmail = (email?: string | null, userEmail?: string | null): boolean => {
  if (!email) {
    return false;
  }
  
  if (!userEmail) {
    return false;
  }
  
  return email.trim().toLowerCase() === userEmail.trim().toLowerCase();
};
