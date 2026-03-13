import { ContentTypes, HttpMethods } from "#shared/constants";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk } from "#api/_utils/http";
import { LoginSchema } from "#shared/schemas/loginSchema";
import { TurnstileVerifyResponse, TurnstileVerifyResponseSchema } from "#shared/schemas/turnstileVerifyResponseSchema";
import { supabaseAdmin } from "#api/_utils/supabase-admin";
import z from "zod";
import { HeaderKeys } from "#shared/constants";

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

if (!TURNSTILE_SECRET_KEY) {
  throw new Error('TURNSTILE_SECRET_KEY is not defined');
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verify the turnstile token.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * @param token - The turnstile token to verify.
 * @returns The turnstile token verification response.
 */
async function verifyTurnstileToken(token: string): Promise<TurnstileVerifyResponse> {
  const verifyResponse = await fetch(TURNSTILE_VERIFY_URL,
    {
      method: HttpMethods.Post,
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
      headers: {
        [HeaderKeys.ContentType]: ContentTypes.Json,
      },
    }
  );

  const data = await verifyResponse.json();
  const parsed = TurnstileVerifyResponseSchema.safeParse(data);

  if (!parsed.success) {
    console.error('API->TURNSTILE_PARSE_ERROR:', parsed.error);
    throw new Error('Failed to parse Turnstile response');
  }

  return parsed.data;
}

async function handleSignIn(email: string, response: VercelResponse) {
  const cleanEmail = email.trim().toLowerCase();

  const { error: authError } = await supabaseAdmin.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
    }
  });

  if (authError) {
    console.error('API->AUTH_ERROR:', authError);
    return httpInternalServerError(response);
  }

  return httpOk(response);
}

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

    // FriendDev: Now that we've verified the turnstile token, we can proceed with the login process.
    return await handleSignIn(email, response);

  } catch (err) {
    console.error('API->ERROR:', err);

    return httpInternalServerError(response);
  }
}