import type { VercelRequest, VercelResponse } from '@vercel/node';
import { encryptWithAes, startEncryptionSession } from './_utils/crypto.js';
import { hashResponseId } from './_utils/hashing.js';
import { createProfileSchema, EncryptedPayloadSchema } from '.././shared/schemas/profileSchema.js';
import { z } from 'zod';
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk } from './_utils/http.js';
import { authenticateUser, checkUserBanned } from './_utils/auth.js';
import { HttpMethods, AppStatusErrors } from '.././shared/constants.js';
import { EncryptionSession } from './types/EncryptionSession.js';
import { isAcceptingResponses } from '.././shared/utils/appStateUtils.js';
import { getAppStatus } from './_shared/db/appStatus.js';
import { insertResponse } from './_shared/db/responses.js';

/**
 * Handle the incoming HTTP request, validate input, and attempt to insert the data into our DB if valid.
 * `default` tells Vercel to run this function when the endpoint is hit.
 * @param request - HTTP request.
 * @param response - HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  // FriendDev: We only accept POST requests since they are submitting data.
  if (request.method !== HttpMethods.Post) {
    return httpMethodNotAllowed(response);
  }

  try {
    // FriendDev: First, check if the app is even open for responses.
    const isAppOpen = await ensureAppIsOpen(response);

    if (!isAppOpen) {
      return;
    }

    // FriendDev: Authenticate the user.
    const user = await authenticateUser(request, response);

    if (!user?.email) {
      return httpBadRequest(response, 'No email found for user.');
    }

    // FriendDev: Check if the user is banned.
    const isBanned = await checkUserBanned(user.email);

    if (isBanned) {
      // FriendDev: Just return the same message as before to avoid leaking info. This is fine for now.
      return httpBadRequest(response, 'No email found for user.');
    }

    // FriendDev: Validate the form response.
    const parseResult = createProfileSchema(user.email).safeParse(request.body);

    if (!parseResult.success) {
      return httpBadRequest(response, JSON.stringify(z.treeifyError(parseResult.error)));
    }

    const formData = parseResult.data;

    // FriendDev: Inject the user's email and user_id into the payload and validate it.
    const payloadParseResult = EncryptedPayloadSchema.safeParse({
      ...formData,
      email: user.email,
      user_id: user.id,
    });

    if (!payloadParseResult.success) {
      console.error('API->PAYLOAD_ERROR:', payloadParseResult.error);
      return httpInternalServerError(response);
    }

    const finalPayload = payloadParseResult.data;

    // FriendDev: Begin Hybrid KEM session.
    const encryptionSession = await startEncryptionSession();

    // FriendDev: Stringify and encrypt the entire payload.
    const jsonPayload = JSON.stringify(finalPayload);
    const encryptedPayload = encryptWithAes(jsonPayload, encryptionSession.derivedSessionKey);

    const { error: dbError } = await saveSurveyToDatabase(user.id, encryptionSession, encryptedPayload);

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);

      return httpInternalServerError(response);
    }

    return httpOk(response);
  } catch (error) {
    console.error("API->ERROR:", error);

    return httpInternalServerError(response);
  }
}


/**
 * Checks if the app is open for responses.
 * @param response - The HTTP response to send if the app is closed.
 * @returns True if the app is open, false otherwise.
 */
export const ensureAppIsOpen = async (response: VercelResponse): Promise<boolean> => {
  const statusResult = await getAppStatus();

  // FriendDev: This code kinda sucks. But, we
  //            need to do these weirdly specific type checks here
  //            so that TS on the Vercel server understands what
  //            types we're working with. It throws errors talkin
  //            about not being able to figure out which type we have if we don't.
  if (statusResult.success === false) {
    if (statusResult.type === AppStatusErrors.NotFound) {
      console.error('API->APP_STATUS_ERROR: Status not configured.');
    } else {
      console.error('API->APP_STATUS_ERROR:', statusResult.type, 'error' in statusResult ? statusResult.error : '');
    }

    httpInternalServerError(response);

    return false;
  }

  if (!isAcceptingResponses(statusResult.data.currentState)) {
    httpBadRequest(response, 'Matching is currently not open.');

    return false;
  }

  return true;
};

export type SaveSurveyResult = {
  error: Error | null;
};

/**
 * Upserts all user responses into the DB using zero-knowledge architecture.
 * @param userId - The ID of the user submitting the survey.
 * @param encryptionSession - The active Hybrid KEM session containing ciphertexts.
 * @param encryptedPayload - The AES-encrypted JSON payload.
 * @returns The result of the database upsert operation.
 */
export const saveSurveyToDatabase = async (
  userId: string,
  encryptionSession: EncryptionSession,
  encryptedPayload: string
): Promise<SaveSurveyResult> => {
  // FriendDev: Use a hash of the user's ID to de-identify them.
  const responseId = hashResponseId(userId);

  try {
    await insertResponse({
      response_id: responseId,
      rsa_ciphertext: encryptionSession.rsaCiphertext,
      mlkem_ciphertext: encryptionSession.mlkemCiphertext,
      encrypted_payload: encryptedPayload,
      submitted_at: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    let mappedError: Error;

    if (error instanceof Error) {
      mappedError = error;
    } else {
      mappedError = new Error(String(error));
    }

    return { error: mappedError };
  }
};