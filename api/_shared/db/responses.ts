import { db } from './kysely.js';
import { Insertable } from 'kysely';
import { ResponsesTable } from './types.js';
import { z } from 'zod';

/**
 * Inserts a new response into the database, or updates it if the response_id already exists.
 * @param payload - The response data to insert.
 * @returns Void on success.
 */
export const insertResponse = async (payload: Insertable<ResponsesTable>): Promise<void> => {
  await db
    .insertInto('responses')
    .values(payload)
    .onConflict((oc) => oc
      .column('response_id')
      .doUpdateSet({
        rsa_ciphertext: (eb) => eb.ref('excluded.rsa_ciphertext'),
        mlkem_ciphertext: (eb) => eb.ref('excluded.mlkem_ciphertext'),
        encrypted_payload: (eb) => eb.ref('excluded.encrypted_payload'),
        submitted_at: (eb) => eb.ref('excluded.submitted_at')
      })
    )
    .execute();
};

/**
 * Deletes a response from the database by response ID.
 * @param responseId - The ID of the response to delete.
 * @returns Void on success.
 */
export const deleteResponse = async (responseId: string): Promise<void> => {
  await db
    .deleteFrom('responses')
    .where('response_id', '=', responseId)
    .execute();
};

/**
 * Schema for validating the count response.  
 * Defaults to 0 for invalid data.
 */
const CountResponseSchema = z.object({
  count: z.coerce.number().catch(0),
}).strict();

type CountResponse = z.input<typeof CountResponseSchema>;

/**
 * Counts the exact number of responses matching the provided response ID.
 * @param responseId - The ID of the response to count.
 * @returns The number of matching responses.
 */
export const countResponses = async (responseId: string): Promise<number> => {
  const result: CountResponse | undefined = await db
    .selectFrom('responses')
    .select((eb) => eb.fn.count<number>('response_id').as('count'))
    .where('response_id', '=', responseId)
    .executeTakeFirst();

  return CountResponseSchema.parse(result).count;
};
