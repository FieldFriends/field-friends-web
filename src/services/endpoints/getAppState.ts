import { type AppStateResponse } from "@shared/schemas/appStateSchema";
import { makeApiRequest } from "../api";
import { HttpMethods } from "@shared/constants";

export async function getAppState(): Promise<AppStateResponse> {
  const response = await makeApiRequest<AppStateResponse>('/api/get-app-state', {
    method: HttpMethods.Get,
    requireAuth: false,
  });

  return response;
}