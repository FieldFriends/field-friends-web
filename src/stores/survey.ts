import { defineStore } from 'pinia';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';
import { getSubmissionStatus } from '@/services/endpoints/getSubmissionStatus';
import { submitSurveyRequest } from '@/services/endpoints/submitSurveyRequest';
import { useAuthStore } from '@/stores/auth';
import { handleStoreError, startStoreLoading } from '@/stores/storeHelpers';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    hasSubmitted: false,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async submitSurvey(formData: ProfileSubmission) {
      this.startLoading();

      try {
        // FriendDev: Instantiate auth store inside the action to avoid
        //            Pinia circular dependency issues at the module level.
        const authStore = useAuthStore();
        const isSessionValid = await authStore.refreshSession();

        if (!isSessionValid || !authStore.session) {
          throw new Error('Your session has expired, please refresh and try again.');
        }

        await submitSurveyRequest(formData);

        // FriendDev: If we get here w/o error then we've submitted.
        this.hasSubmitted = true;

        return true;
      } catch (err: any) {
        this.handleError(err, 'An unexpected error occurred during submission.');

        // FriendDev: Throw for snackbar.
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async checkSubmissionStatus() {
      const authStore = useAuthStore();

      if (!authStore.session) {
        return;
      }

      this.startLoading();

      try {
        this.hasSubmitted = await getSubmissionStatus();
      } catch (err) {
        this.handleError(err, 'Failed to check submission status.');
      } finally {
        this.loading = false;
      }
    },

    handleError(err: any, fallback: string): string {
      return handleStoreError(this, err, fallback);
    },

    startLoading() {
      startStoreLoading(this);
    },
  },
});
