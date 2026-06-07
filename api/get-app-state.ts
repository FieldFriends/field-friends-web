import { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpMethods, AppStatusErrors } from '.././shared/constants.js';
import { httpInternalServerError, httpMethodNotAllowed, httpNotFound, httpOk } from './_utils/http.js';
import { getAppStatus } from './_shared/db/appStatus.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  const statusResult = await getAppStatus();

  if (statusResult.success) {
    return httpOk(response, statusResult.data);
  }

  if (statusResult.type === AppStatusErrors.NotFound) {
    return httpNotFound(response, 'App status not found');
  }

  return httpInternalServerError(response);
}