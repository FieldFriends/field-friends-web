import type { useSurveyStore } from "@/stores/survey";

/**
 * A helper function to determine if the user has submitted the form.
 * @param surveyStore - The survey store.
 * @returns A promise that resolves to a boolean indicating if the user has submitted the form.
 */
export const hasUserSubmitted = async (surveyStore: ReturnType<typeof useSurveyStore>): Promise<boolean> => {
  if (surveyStore.hasSubmitted) {
    return true;
  }

  await surveyStore.checkSubmissionStatus();

  return surveyStore.hasSubmitted;
};