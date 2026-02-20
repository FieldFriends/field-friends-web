import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { extractAuthToken, httpUnauthorized } from '#api/_utils/http';
import { User } from '@supabase/supabase-js';

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

  if (authError || !user || !user.email) {
    httpUnauthorized(response, "Invalid user token");
    return null;
  }

  return user;
};