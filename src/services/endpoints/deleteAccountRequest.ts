import { makeApiRequest } from "../api";
import { HttpMethods } from "#shared/constants";

export async function deleteAccountRequest(): Promise<void> {
  await makeApiRequest('/api/delete-account', {
    method: HttpMethods.Delete,
    requireAuth: true,
  });
}
