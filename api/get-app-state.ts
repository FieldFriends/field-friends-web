import { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpMethods, AppStatusErrors } from '.././shared/constants.js';
import { httpInternalServerError, httpMethodNotAllowed, httpNotFound, httpOk } from './_utils/http.js';
import { fetchAndValidateAppStatus } from './_utils/app-state.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  const statusResult = await fetchAndValidateAppStatus();

  if (!statusResult.success) {
    if (statusResult.type === AppStatusErrors.NotFound) {
      return httpNotFound(response, 'App status not found');
    }

    return httpInternalServerError(response);
  }

  return httpOk(response, statusResult.data);
}