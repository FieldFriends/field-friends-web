import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from '#api/_utils/http';
import { authenticateUser } from '#api/_utils/auth';
import { HttpMethods } from '#shared/constants';

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
