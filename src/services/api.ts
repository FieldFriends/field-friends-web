import { ApiRequest, type IApiRequest } from "@/types/apiRequest";
import { ContentTypes, HeaderKeys } from "#shared/constants";
import { supabase } from "./supabase";
import { constructBearerHeader } from "@/utils/apiUtils";

/**
 * A standardized wrapper around the native fetch API.
 * Handles authentication injection, header management, and error parsing.
 */
export async function makeApiRequest<T>(endpoint: string, options: IApiRequest): Promise<T> {

  // FriendDev: Instantiate, using defaults from our ApiRequest class.
  const request: ApiRequest = new ApiRequest(options);

  // FriendDev: Always start with JSON content type, then merge in any custom headers.
  //            Basically sets JSON as default but can be overridden.
  const requestHeaders: HeadersInit = {
    [HeaderKeys.ContentType]: ContentTypes.Json,
    ...(request.headers || {})
  }

  // FriendDev: Validate session if auth is required.
  if (request.requireAuth) {
    const { data } = await supabase.auth.getSession();

    const token = data.session?.access_token;

    if (!token) {
      throw new Error('Authentication required. No valid session found.');
    }

    // FriendDev: Since we have a valid token, inject it using the Bearer scheme.
    requestHeaders[HeaderKeys.Authorization] = constructBearerHeader(token);
  }

  // FriendDev: Execute the request.
  const response = await fetch(endpoint, {
    method: request.method,
    headers: requestHeaders,
    body: request.body ? JSON.stringify(request.body) : undefined
  });

  // FriendDev: Handle errors.
  if (!response.ok) {
    let errorMessage = 'An error occured.';

    try {
      const errorData = await response.json();

      // FriendDev: Try to give a more concrete error.
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // FriendDev: If we cannot get the response data due to some error, get the human-readable
      //            version of the response code.
      errorMessage = response.statusText;
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>
}