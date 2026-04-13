import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_utils/supabase-admin.js';
import { extractAuthToken, httpUnauthorized } from '../_utils/http.js';
import { hashEmail } from '../_utils/hashing.js';
import { User } from '@supabase/supabase-js';

/**
 * Check if a user is banned. Checks if the user's email,
 * when hashed with the current pepper, exists in the banned table.
 * @param email - The email to check.
 * @returns True if the user is banned, false otherwise.
 */
export async function checkUserBanned(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const hashedEmail = hashEmail(cleanEmail);

  // FriendDev: Attempt to find the user in the banned table.
  const { data, error } = await supabaseAdmin
    .from('banned_users')
    .select('id')
    .eq('email_hash', hashedEmail)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('API->BANNED_USER_CHECK_ERROR:', error);
    throw new Error('Failed to check if user is banned');
  }

  // FriendDev: The presence of data indicates the user is banned.
  return !!data;
}

/**
 * Authenticates the user from the request headers.
 * If authentication fails, this function sends
 * the HTTP 401 response directly and returns null.
 * * @returns The authenticated User object, or null if auth failed.
 */
export const authenticateUser = async (request: VercelRequest, response: VercelResponse): Promise<User | null> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    httpUnauthorized(response, 'Missing authentication token');
    return null;
  }

  // FriendDev: Now get the token to send to Supabase.
  const token: string | null = extractAuthToken(authHeader);

  if (!token) {
    httpUnauthorized(response, "Missing or invalid authentication token");
    return null;
  }

  // FriendDev: Now, verify the token with Supabase.
  //            This will tell us who the user actually is.
  const { data, error: authError } = await supabaseAdmin.auth.getUser(token);
  const user = data.user;

  if (authError || !user?.email) {
    httpUnauthorized(response, "Invalid user token");
    return null;
  }

  return user;
};