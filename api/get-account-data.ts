import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { httpInternalServerError, httpMethodNotAllowed, httpNotFound, httpOk } from '#api/_utils/http';
import { authenticateUser } from '#api/_utils/auth';
import { HttpMethods } from '#shared/constants';
import { AccountDataResponseSchema } from '#shared/schemas/accountDataSchema';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  try {
    const user = await authenticateUser(request, response);

    if (!user?.email) {
      return;
    }

    const { data, error: dbError } = await supabaseAdmin
      .from('responses')
      .select('gender, age, affiliation, social_energy, submitted_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);
      return httpInternalServerError(response);
    }

    if (!data) {
      return httpNotFound(response, 'User data not found');
    }

    return httpOk(response, data, AccountDataResponseSchema);
  } catch (error) {
    console.error('API->ERROR:', error);
    return httpInternalServerError(response);
  }
}
