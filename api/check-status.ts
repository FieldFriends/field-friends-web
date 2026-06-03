import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_utils/supabase-admin.js';
import { hashResponseId } from './_utils/hashing.js';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from './_utils/http.js';
import { z } from 'zod';
import { authenticateUser } from './_utils/auth.js';
import { HttpMethods } from '.././shared/constants.js';

const CheckStatusResponse = z.object({
  submitted: z.boolean(),
});

/**
 * Handle the incoming HTTP request to check if the user has submitted a form response.
 * @param request - HTTP request.
 * @param response - HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  try {
    const user = await authenticateUser(request, response);

    if (!user?.email) {
      return;
    }

    // FriendDev: Hash the user's ID to find the de-identified response record.
    const responseId = hashResponseId(user.id);

    const { count, error: dbError } = await supabaseAdmin
      .from('responses')
      .select('response_id', { count: 'exact', head: true })
      .eq('response_id', responseId);

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);

      return httpInternalServerError(response);
    }

    const hasSubmitted = (count !== null) && (count > 0);

    const data: z.infer<typeof CheckStatusResponse> = {
      submitted: hasSubmitted
    };

    return httpOk(response, data, CheckStatusResponse);
  } catch (error) {
    console.error('API->ERROR:', error);

    return httpInternalServerError(response);
  }
}