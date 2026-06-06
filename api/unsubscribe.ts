import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './_utils/supabase-admin.js';
import { getPublicKey } from './_utils/crypto.js';
import {
  httpBadRequest,
  httpInternalServerError,
  httpMethodNotAllowed,
  httpOk
} from './_utils/http.js';
import { HttpMethods, JwtConstants } from '.././shared/constants.js';
import { UnsubscribeSchema } from '.././shared/schemas/unsubscribeSchema.js';
import { UnsubscribeRequestSchema } from '.././shared/schemas/unsubscribeRequestSchema.js';
import { hashResponseId } from './_utils/hashing.js';
import { deleteResponse } from './_shared/db/responses.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== HttpMethods.Post) {
    return httpMethodNotAllowed(response);
  }

  try {
    // FriendDev: Validate we have a proper JWT.
    const unsubscribeRequest = UnsubscribeRequestSchema.safeParse(request.body);

    if (!unsubscribeRequest.success) {
      return httpBadRequest(response, 'Invalid request body.');
    }

    const { token } = unsubscribeRequest.data;

    // FriendDev: Retrieve the public key.
    const publicKey = getPublicKey();

    let decodedPayload: unknown;

    try {
      // FriendDev: Verify w/ RS256.
      decodedPayload = jwt.verify(token, publicKey, { algorithms: [JwtConstants.Algorithm] });
    } catch (err) {
      console.error('API->JWT_VERIFY_ERROR:', err);
      return httpBadRequest(response, 'Invalid or expired token.');
    }

    // FriendDev: Validate the payload contained in the JWT. Ensure it's a proper unsubscribe request.
    const unsubscribePayload = UnsubscribeSchema.safeParse(decodedPayload);

    if (!unsubscribePayload.success) {
      console.error('API->JWT_PAYLOAD_SCHEMA_ERROR:', unsubscribePayload.error);
      return httpBadRequest(response, 'Invalid token payload.');
    }

    const userId = unsubscribePayload.data.sub;

    // FriendDev: Explicitly delete the survey response to prevent retaining private
    //            data against the user's wishes. There is no DB cascade for this.
    const responseId = hashResponseId(userId);

    try {
      await deleteResponse(responseId);
    } catch (dbError) {
      console.error('API->UNSUBSCRIBE_DB_ERROR:', dbError);
      return httpInternalServerError(response);
    }

    // FriendDev: Delete the user account so they don't get emails.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('API->AUTH_DELETE_ERROR:', authError);
      return httpInternalServerError(response);
    }

    return httpOk(response);

  } catch (error) {
    console.error('API->UNSUBSCRIBE_ERROR:', error);
    return httpInternalServerError(response);
  }
}
