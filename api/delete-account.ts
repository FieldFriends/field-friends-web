import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_utils/supabase-admin.js';
import { hashResponseId } from './_utils/hashing.js';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from './_utils/http.js';
import { deleteResponse } from './_shared/db/responses.js';
import { authenticateUser } from './_utils/auth.js';
import { HttpMethods } from '.././shared/constants.js';

/**
 * Handle the incoming HTTP request to delete the user's account and survey response.
 * @param request - HTTP request.
 * @param response - HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Delete) {
    return httpMethodNotAllowed(response);
  }

  try {
    const user = await authenticateUser(request, response);

    if (!user?.email) {
      return;
    }

    const responseId = hashResponseId(user.id);

    try {
      await deleteResponse(responseId);
    } catch (dbError) {
      console.error('API->DB_ERROR:', dbError);

      return httpInternalServerError(response);
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error('API->AUTH_ERROR:', authError);

      return httpInternalServerError(response);
    }

    return httpOk(response);

  } catch (error) {
    console.error("API->ERROR:", error);

    return httpInternalServerError(response);
  }
}
