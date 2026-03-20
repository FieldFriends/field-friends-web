import { HttpMethods } from "#shared/constants";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { httpInternalServerError, httpMethodNotAllowed, httpNotFound, httpOk } from "./_utils/http";
import { supabaseAdmin } from "./_utils/supabase-admin";
import { appStateResponseSchema } from "#shared/schemas/appStateSchema";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  try {
    const { data, error: dbError } = await supabaseAdmin
      .from('app_status')
      .select('currentState:current_state, roundStart:round_start, roundEnd:round_end')
      .maybeSingle();

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);
      return httpInternalServerError(response);
    }

    if (!data) {
      return httpNotFound(response, 'App status not found');
    }

    return httpOk(response, data, appStateResponseSchema);
  } catch (error) {
    console.error('API->ERROR:', error);
    return httpInternalServerError(response);
  }
}