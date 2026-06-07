import { ContentTypes, HttpMethods, HeaderKeys, TurnstileConstants } from '.././shared/constants.js';
import { VercelRequest, VercelResponse } from "@vercel/node";
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk, httpForbidden } from './_utils/http.js';
import { LoginSchema } from '.././shared/schemas/loginSchema.js';
import { TurnstileVerifyResponse, TurnstileVerifyResponseSchema } from '.././shared/schemas/turnstileVerifyResponseSchema.js';
import { supabaseAdmin } from './_utils/supabase-admin.js';
import z from "zod";
import { checkUserBanned } from './_utils/auth.js';
import { getAppStatus } from './_shared/db/appStatus.js';
import { isAcceptingResponses } from '../shared/utils/appStateUtils.js';
import { SERVER_ENV } from './_utils/server-env.js';

/**
 * Verify the turnstile token.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * @param token - The turnstile token to verify.
 * @returns The turnstile token verification response.
 */
async function verifyTurnstileToken(token: string): Promise<TurnstileVerifyResponse> {
  const verifyResponse = await fetch(TurnstileConstants.VerifyUrl,
    {
      method: HttpMethods.Post,
      body: JSON.stringify({
        secret: SERVER_ENV.TURNSTILE_SECRET_KEY,
        response: token,
      }),
      headers: {
        [HeaderKeys.ContentType]: ContentTypes.Json,
      },
    }
  );

  const turnstileResponse = await verifyResponse.json();
  const parsedTurnstileResponse = TurnstileVerifyResponseSchema.safeParse(turnstileResponse);

  if (!parsedTurnstileResponse.success) {
    console.error('API->TURNSTILE_PARSE_ERROR:', parsedTurnstileResponse.error);

    throw new Error('Failed to parse turnstile response');
  }

  return parsedTurnstileResponse.data;
}

/**
 * Handle the sign-in process.
 * @param email - The email to sign in.
 * @param response - The response to send.
 * @returns The HTTP response.
 */
async function handleSignIn(email: string, response: VercelResponse) {
  const statusResult = await getAppStatus();

  if (!statusResult.success) {
    console.error('API->LOGIN->APP_STATUS_ERROR');
    return httpInternalServerError(response);
  }

  // FriendDev: Check if app is open.
  const isOpen = isAcceptingResponses(statusResult.data.currentState);

  const cleanEmail = email.trim().toLowerCase();

  const { error: authError } = await supabaseAdmin.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      // FriendDev: If app is open, allow account creation. Otherwise, 
      //            only allow existing users to login to delete their data.
      shouldCreateUser: isOpen,
    }
  });

  if (authError) {
    if (authError.code === 'otp_disabled') {
      return httpForbidden(response, 'Field Friends is currently paused and is not accepting new users.');
    }

    console.error('API->AUTH_ERROR:', authError);
    return httpInternalServerError(response);
  }

  return httpOk(response);
}

/**
 * Handle the login API request.
 * @param request - The HTTP request from the client.
 * @param response - The HTTP response to send.
 * @returns The HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Post) {
    return httpMethodNotAllowed(response);
  }

  try {
    const parseResult = LoginSchema.safeParse(request.body);

    // FriendDev: Verify the email matches our schema.
    //            Must be @illinois.edu.
    if (!parseResult.success) {
      return httpBadRequest(response, JSON.stringify(z.treeifyError(parseResult.error)));
    }
    const { email, turnstileToken } = parseResult.data;

    // FriendDev: Verify the turnstile token.
    const verifyData = await verifyTurnstileToken(turnstileToken);

    if (!verifyData.success) {
      return httpBadRequest(response, 'Security check failed, please try again.');
    }

    // FriendDev: Now we need to query the banned table to see if we should even send an email.
    //            Also prevents bounced emails from ruining our sender reputation.
    const isBanned = await checkUserBanned(email);

    // FriendDev: Return OK even if banned to prevent email enumeration.
    if (isBanned) {
      return httpOk(response);
    }

    // FriendDev: Now that we've verified the turnstile token, we can proceed with the login process.
    return await handleSignIn(email, response);

  } catch (err) {
    console.error('API->ERROR:', err);

    return httpInternalServerError(response);
  }
}