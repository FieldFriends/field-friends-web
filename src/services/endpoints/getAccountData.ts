import { makeApiRequest } from "../api";
import { HttpMethods } from "@shared/constants";
import type { AccountDataResponse } from "@shared/schemas/accountDataSchema";

export async function getAccountData(): Promise<AccountDataResponse> {
  return await makeApiRequest<AccountDataResponse>('/api/get-account-data', {
    method: HttpMethods.Get,
    requireAuth: true,
  });
}
