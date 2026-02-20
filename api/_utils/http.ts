import { VercelResponse } from "@vercel/node";
import { ZodType } from "zod";
import { AuthorizationSchemes } from "#shared/constants";


/**
 * Sends a 200 OK response.
 * @param response - Vercel response object.
 * @param data - Data to send.
 * @param schema - Optional Zod schema to validate data before sending. 
 */
export const httpOk = <T>(response: VercelResponse, data?: T, schema?: ZodType<T>) => {
  const Ok: number = 200;

  if (data) {
    // FriendDev: If we have a schema, validate the data and return it.
    if (schema) {
      // FriendDev: Validate our schema.
      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        console.error("API->RESPONSE_MISMATCH", parseResult.error);

        return httpInternalServerError(response);
      }

      return response.status(Ok).json(parseResult.data);
    }

    // FriendDev: Just return the raw data since we have no schema.
    return response.status(Ok).json(data);
  }

  return response.status(Ok).json({ success: true, message: 'OK' });
}

// export const httpOk = (response: VercelResponse, data?: any) => {
//   return response.status(200).json({ success: true, message: 'OK' });
// };

export const httpBadRequest = (response: VercelResponse, details: string) => {
  return response.status(400).json({ error: 'Bad Request', details: details });
};

export const httpUnauthorized = (response: VercelResponse, message: string) => {
  return response.status(401).json({ error: 'Unauthorized', message: message });
};

export const httpMethodNotAllowed = (response: VercelResponse) => {
  return response.status(405).json({ error: 'Method Not Allowed' });
};

export const httpInternalServerError = (response: VercelResponse) => {
  return response.status(500).json({ error: 'Internal Server Error' });
};

/**
 * Extract the raw bearer token from the given auth header.
 * @param header - HTTP auth header.
 * @returns - The raw token, with the "Bearer" label stripped.
 */
export const extractAuthToken = (header: string | undefined): string | null => {
  if (!header) {
    return null;
  }

  // FriendDev: We're expecting the auth header to look something like:
  //            "Bearer <token>"
  //             So, split by whitespace to separate the value from the scheme.
  //             "/" are JS delimiters.
  //             "\s" is whitespace.
  //             "+" means one or more.
  //             Matches any continuous string of whitespace, which is exactly what we want to split on.
  const parts = header.split(/\s+/);

  // FriendDev: We want EXACTLY 2 parts: schema, token.
  //            If not, invalid.
  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  // FriendDev: Ensure we have the right scheme.
  if (scheme.toLowerCase() !== AuthorizationSchemes.Bearer.toLowerCase()) {
    return null;
  }

  // FriendDev: Now we can return the raw token without the scheme name attached.
  //            Trim as an extra measure of safety.
  return token.trim();
}