import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { encryptWithAes, startEncryptionSession } from '#api/_utils/crypto';
import { ProfileSchema } from '#shared/schemas/profileSchema';
import { z } from 'zod';
import { httpBadRequest, httpInternalServerError, httpMethodNotAllowed, httpOk } from '#api/_utils/http';
import { authenticateUser } from '#api/_utils/auth';
import { HttpMethods } from '#shared/constants';
import { EncryptionSession } from '#api/types/EncryptionSession';

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
    const user = await authenticateUser(request, response);

    if (!user || !user.email) {
      return;
    }

    // FriendDev: Now, attempt to parse the user data. It should be a JSON body.
    const parseResult = ProfileSchema.safeParse(request.body);

    if (!parseResult.success) {
      return httpBadRequest(response, JSON.stringify(z.treeifyError(parseResult.error)));
    }

    const formData = parseResult.data;

    // FriendDev: Encrypt the data.
    const encryptionSession: EncryptionSession = startEncryptionSession();

    const encryptedName = encryptWithAes(formData.name, encryptionSession.rawSessionKey);
    const encryptedEmail = encryptWithAes(user.email, encryptionSession.rawSessionKey);
    const encryptedInterests = encryptWithAes(formData.interests, encryptionSession.rawSessionKey);
    const encryptedActivities = encryptWithAes(formData.activities, encryptionSession.rawSessionKey);
    const encryptedIntroduction = encryptWithAes(formData.introduction || '', encryptionSession.rawSessionKey);

    // FriendDev: Loop through each one and encrypt them individually.
    const encryptedBlocked = formData.blocked_emails.map(email => encryptWithAes(email, encryptionSession.rawSessionKey));

    // FriendDev: "Upsert" means update or inset. Do this based on user_id.
    //            Allows users to edit their response if they submit again.
    const { error: dbError } = await supabaseAdmin
      .from('responses')
      .upsert({
        user_id: user.id,

        gender: formData.gender,
        age: formData.age,
        affiliation: formData.affiliation,
        social_energy: formData.social_energy,

        // FriendDev: Never store the plaintext responses.
        name: encryptedName,
        email: encryptedEmail,
        interests: encryptedInterests,
        activities: encryptedActivities,
        introduction: encryptedIntroduction,
        blocked_emails: encryptedBlocked,

        // FriendDev: Store the RSA-encrypted session key, which contains the AES
        //            key to decrypt the encrypted fields.
        session_key: encryptionSession.encryptedSessionKey,

        submitted_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('API->DB_ERROR:', dbError);
      return httpInternalServerError(response);
    }

    // FriendDev: Success!
    return httpOk(response);

  } catch (error) {
    // FriendDev: Safely log internally.
    console.error("API->ERROR:", error);

    return httpInternalServerError(response);
  }
}