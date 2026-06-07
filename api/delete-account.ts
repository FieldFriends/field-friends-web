import type { VercelRequest, VercelResponse } from '@vercel/node';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from './_utils/http.js';
import { deleteUserAccountAndResponse } from './_utils/account.js';
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

    await deleteUserAccountAndResponse(user.id);

    return httpOk(response);

  } catch (error) {
    console.error("API->ERROR:", error);

    return httpInternalServerError(response);
  }
}
