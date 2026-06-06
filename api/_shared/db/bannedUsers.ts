import { db } from './kysely.js';
import { z } from 'zod';

/**
 * Bulk upserts banned users by their email hash.
 * @param payloads - Array of objects containing the email hash and reason.
 * @returns Void on success.
 */
export const upsertBannedUsers = async (payloads: { email_hash: string; reason: string }[]): Promise<void> => {
  if (payloads.length === 0) {
    return;
  }

  await db
    .insertInto('banned_users')
    .values(payloads)
    .onConflict((oc) => oc
      .column('email_hash')
      .doUpdateSet({
        reason: (eb) => eb.ref('excluded.reason')
      })
    )
    .execute();
};

const BannedUserSchema = z.object({
  id: z.string(),
}).strict();

type BannedUserResponse = z.infer<typeof BannedUserSchema>;

/**
 * Fetches a banned user by their email hash.
 * @param emailHash - The hashed email to look up.
 * @returns The banned user ID object, or undefined if not found.
 */
export const getBannedUserByHash = async (emailHash: string): Promise<BannedUserResponse | undefined> => {
  const userResult: BannedUserResponse | undefined = await db
    .selectFrom('banned_users')
    .select('id')
    .where('email_hash', '=', emailHash)
    .executeTakeFirst();

  if (!userResult) {
    return undefined;
  }

  const parseResult = BannedUserSchema.safeParse(userResult);
  
  if (!parseResult.success) {
    console.error('API->_shared->db->bannedUsers->SCHEMA_ERROR:', parseResult.error);
    return undefined;
  }

  return parseResult.data;
};
