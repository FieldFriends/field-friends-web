import { type SubmissionStatusResponse } from "@/types/submissionStatusResponse";
import { makeApiRequest } from "../api";
import { HttpMethods } from "#shared/constants";

export async function getSubmissionStatus(): Promise<boolean> {
  const response = await makeApiRequest<SubmissionStatusResponse>('/api/check-status', {
    method: HttpMethods.Get,
    requireAuth: true,
  });

  return response.submitted;
}