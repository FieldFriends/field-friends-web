import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { encryptWithAes, startEncryptionSession } from '#api/_utils/crypto';
import { ProfileSchema } from '#shared/schemas/profileSchema';
import { z } from 'zod';
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk } from '#api/_utils/http';
import { authenticateUser, checkUserBanned } from '#api/_utils/auth';
import { HttpMethods, AppStatusErrors } from '#shared/constants';
import { EncryptionSession } from '#api/types/EncryptionSession';
import { isAcceptingResponses } from '#shared/utils/appStateUtils';
import { fetchAndValidateAppStatus } from '#api/_utils/app-state';
import { EncryptedSurveyData } from '#api/types/EncryptedSurveyData';

/**
 * Handle the incoming HTTP request, validate input, and attempt to insert the data into our DB if valid.
 * "default" tells Vercel to run this function when the endpoint is hit.
 * @param request - HTTP request.
 * @param response - HTTP response.
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  // FriendDev: We only accept POST requests since they are SUBMITTING data.
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
    const parseResult = ProfileSchema.safeParse(request.body);

    if (!parseResult.success) {
      return httpBadRequest(response, JSON.stringify(z.treeifyError(parseResult.error)));
    }

    const formData = parseResult.data;

    // FriendDev: Encrypt sensitive fields.
    const encryptedData = encryptSurveyData(formData, user.email);

    // FriendDev: Upsert allows users to overwrite their response if they submit again.
    const { error: dbError } = await saveSurveyToDatabase(user.id, formData, encryptedData);

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);
      return httpInternalServerError(response);
    }

    // FriendDev: Success!
    return httpOk(response);

  } catch (error) {
    console.error("API->ERROR:", error);
    return httpInternalServerError(response);
  }
}

// ============================================================================
// MODULAR HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if the app is open for responses.
 * @param response - The HTTP response to send if the app is closed.
 * @returns True if the app is open, false otherwise.
 */
export const ensureAppIsOpen = async (response: VercelResponse): Promise<boolean> => {
  const statusResult = await fetchAndValidateAppStatus();

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


/**
 * Encrypts sensitive fields within the user's survey response.
 * @param formData - The user's survey response.
 * @param email - The user's email.
 * @returns The encrypted survey data.
 */
export const encryptSurveyData = (formData: z.infer<typeof ProfileSchema>, email: string): EncryptedSurveyData => {
  const encryptionSession: EncryptionSession = startEncryptionSession();

  const encryptedName = encryptWithAes(formData.name, encryptionSession.rawSessionKey);
  const encryptedEmail = encryptWithAes(email, encryptionSession.rawSessionKey);
  const encryptedInterests = encryptWithAes(formData.interests, encryptionSession.rawSessionKey);
  const encryptedActivities = encryptWithAes(formData.activities, encryptionSession.rawSessionKey);
  const encryptedIntroduction = encryptWithAes(formData.introduction || '', encryptionSession.rawSessionKey);

  const encryptedBlocked = formData.blocked_emails.map(e => encryptWithAes(e, encryptionSession.rawSessionKey));

  return new EncryptedSurveyData(
    encryptedName,
    encryptedEmail,
    encryptedInterests,
    encryptedActivities,
    encryptedIntroduction,
    encryptedBlocked,
    encryptionSession.encryptedSessionKey
  );
};

/**
 * Upserts all user responses into the DB.
 * @param userId - The ID of the user submitting the survey.
 * @param formData - The user's survey response.
 * @param encryptedData - The encrypted survey data.
 * @returns The result of the database upsert operation.
 */
export const saveSurveyToDatabase = async (
  userId: string,
  formData: z.infer<typeof ProfileSchema>,
  encryptedData: EncryptedSurveyData
) => {
  return await supabaseAdmin
    .from('responses')
    .upsert({
      user_id: userId,

      gender: formData.gender,
      age: formData.age,
      affiliation: formData.affiliation,
      social_energy: formData.social_energy,

      // FriendDev: Never store the plaintext PII responses.
      name: encryptedData.encryptedName,
      email: encryptedData.encryptedEmail,
      interests: encryptedData.encryptedInterests,
      activities: encryptedData.encryptedActivities,
      introduction: encryptedData.encryptedIntroduction,
      blocked_emails: encryptedData.encryptedBlocked,

      // FriendDev: Store the RSA-encrypted session key, which contains the AES key to decrypt.
      session_key: encryptedData.sessionKey,

      submitted_at: new Date().toISOString(),
    });
};