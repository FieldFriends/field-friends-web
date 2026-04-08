import { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpMethods, AppStatusErrors } from "#shared/constants";
import { httpInternalServerError, httpMethodNotAllowed, httpNotFound, httpOk } from "#api/_utils/http";
import { fetchAndValidateAppStatus } from "#api/_utils/app-state";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Get) {
    return httpMethodNotAllowed(response);
  }

  const statusResult = await fetchAndValidateAppStatus();

  if (statusResult.success) {
    return httpOk(response, statusResult.data);
  }

  if (statusResult.type === AppStatusErrors.NotFound) {
    return httpNotFound(response, 'App status not found');
  }

  return httpInternalServerError(response);
}