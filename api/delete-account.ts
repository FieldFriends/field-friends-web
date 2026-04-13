import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_utils/supabase-admin.js';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from './_utils/http.js';
import { authenticateUser } from './_utils/auth.js';
import { HttpMethods } from '.././shared/constants.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Delete) {
    return httpMethodNotAllowed(response);
  }

  try {
    const user = await authenticateUser(request, response);

    if (!user?.email) {
      return;
    }

    const { error: dbError } = await supabaseAdmin
      .from('responses')
      .delete()
      .eq('user_id', user.id);

    if (dbError) {
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
