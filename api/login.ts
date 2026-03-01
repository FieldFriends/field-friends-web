import { HttpMethods } from "#shared/constants";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk } from "#api/_utils/http";
import { LoginSchema } from "#shared/schemas/loginSchema";
import { supabaseAdmin } from "#api/_utils/supabase-admin";
import z from "zod";

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

    const { email } = parseResult.data;

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
  } catch (err) {
    console.error('API->ERROR:', err);

    return httpInternalServerError(response);
  }
}