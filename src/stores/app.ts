import { defineStore } from 'pinia';
import type { ProfileSubmission } from '#shared/schemas/profileSchema';
import { getSubmissionStatus } from '@/services/endpoints/getSubmissionStatus';
import { submitSurveyRequest } from '@/services/endpoints/submitSurveyRequest';
import { authService } from '@/services/authService';
import type { Session } from '@supabase/supabase-js';

export const useAppStore = defineStore('app', {
  state: () => ({
    session: null as Session | null,
    loading: false,
    // FriendDev: Track if the user has submitted.
    hasSubmitted: false,
    error: null as string | null,
  }),

  actions: {
    // FriendDev: Init auth to get our JWT.
    async initAuth() {
      const { session } = await authService.getSession();
      this.session = session;

      authService.onAuthStateChange((_event, session) => {
        this.session = session;
      });
    },

    // FriendDev: Use just-in-time verification, refresh right before submission.
    async refreshSession(): Promise<boolean> {
      const { session, error } = await authService.getSession();

      if (error || !session) {
        this.session = null;
        return false;
      }

      this.session = session;
      return true;
    },

    async signOut() {
      await authService.signOut();
      this.session = null;
      this.hasSubmitted = false;
    },

    async submitSurvey(formData: ProfileSubmission) {
      const isSessionValid = await this.refreshSession();

      if (!isSessionValid || !this.session) {
        this.error = 'Your session has expired, please refresh and try again.';
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        await submitSurveyRequest(formData);

        // FriendDev: We've submitted now.
        this.hasSubmitted = true;

        return true;
      } catch (err: any) {
        console.error(err);

        this.error = err.message || 'An unexpected error occurred.';

        return false;
      } finally {
        this.loading = false;
      }
    },

    async checkSubmissionStatus() {
      if (!this.session) {
        return;
      }

      this.loading = true;

      try {
        this.hasSubmitted = await getSubmissionStatus();
      } catch (error) {
        console.error('Failed to check status: ', error);
      } finally {
        this.loading = false;
      }
    }
  },
});