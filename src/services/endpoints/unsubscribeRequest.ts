import { makeApiRequest } from "../api";
import { HttpMethods } from "#shared/constants";
import type { UnsubscribeRequest } from '#shared/schemas/unsubscribeRequestSchema';

export async function unsubscribeRequest(payload: UnsubscribeRequest): Promise<void> {
  await makeApiRequest('/api/unsubscribe', {
    method: HttpMethods.Post,
    body: payload,
    requireAuth: false
  });
}
