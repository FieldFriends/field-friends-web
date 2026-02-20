import { HttpMethods } from "#shared/constants";
import { makeApiRequest } from "../api";
import type { ProfileSubmission } from "#shared/schemas/profileSchema";

/**
 * Submits the user's encrypted profile data to the backend.
 * @param formData - User's responses.
 */
export async function submitSurveyRequest(formData: ProfileSubmission): Promise<void> {

  await makeApiRequest('/api/submit-survey', {
    method: HttpMethods.Post,
    body: formData,
    requireAuth: true
  });
}