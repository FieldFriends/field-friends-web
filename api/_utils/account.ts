import { supabaseAdmin } from './supabase-admin.js';
import { hashResponseId } from './hashing.js';
import { deleteResponse } from '../_shared/db/responses.js';

/**
 * Deletes a user's survey response and their authentication account.
 * This ensures no private data is retained and the user won't receive further emails.
 * @param userId - The ID of the user to delete.
 */
export async function deleteUserAccountAndResponse(userId: string): Promise<void> {
  const responseId = hashResponseId(userId);

  try {
    await deleteResponse(responseId);
  } catch (dbError) {
    console.error('API->ACCOUNT_DELETION_DB_ERROR:', dbError);
    throw new Error('Failed to delete user response data.');
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    console.error('API->ACCOUNT_DELETION_AUTH_ERROR:', authError);
    throw new Error('Failed to delete user authentication account.');
  }
}
