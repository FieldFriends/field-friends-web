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

    // FriendDev: Delete the user. Deleting them will cascade, and will ensure they won't
    //            receive more emails. Since accounts are ephemeral anyway,
    //            and because the service requires emails to work, deleting makes sense.
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
