import { defineStore } from 'pinia';
import type { ProfileSubmission } from '#shared/schemas/profileSchema';
import { getSubmissionStatus } from '@/services/endpoints/getSubmissionStatus';
import { submitSurveyRequest } from '@/services/endpoints/submitSurveyRequest';
import { authService } from '@/services/authService';
import type { Session } from '@supabase/supabase-js';
import { AppState, type AppStateResponse } from '#shared/schemas/appStateSchema';
import { getAppState } from '@/services/endpoints/getAppState';

export const useAppStore = defineStore('app', {
  state: () => ({
    session: null as Session | null,
    loading: false,
    hasSubmitted: false,
    appState: AppState.Closed,
    appStateDetails: null as AppStateResponse | null,
    isAppStateLoaded: false,
    error: null as string | null,
  }),

  actions: {
    // FriendDev: Init auth to get our JWT.
    async initAuth() {
      this.startLoading();

      try {
        const { session, error } = await authService.getSession();

        if (error) {
          throw error;
        }

        this.session = session;

        authService.onAuthStateChange((_event, session) => {
          this.session = session;
        });
      } catch (err) {
        this.handleError(err, 'Failed to initialize authentication.');
      } finally {
        this.loading = false;
      }
    },

    // FriendDev: Use just-in-time verification, refresh right before submission.
    async refreshSession(): Promise<boolean> {
      try {
        const { session, error } = await authService.getSession();

        if (error || !session) {
          this.session = null;
          return false;
        }

        this.session = session;
        return true;
      } catch (err) {
        this.handleError(err, 'Failed to refresh session.');
        return false;
      }
    },

    async signOut() {
      this.startLoading();

      try {
        const { error } = await authService.signOut();

        if (error) {
          throw error;
        }

        this.session = null;
        this.hasSubmitted = false;
      } catch (err) {
        this.handleError(err, 'Failed to sign out.');
      } finally {
        this.loading = false;
      }
    },

    async submitSurvey(formData: ProfileSubmission) {
      this.startLoading();

      try {
        const isSessionValid = await this.refreshSession();

        if (!isSessionValid || !this.session) {
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
      if (!this.session) {
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
    async fetchAppState() {
      this.startLoading();

      try {
        const data = await getAppState();

        this.appStateDetails = data;
        this.appState = data.currentState;
        this.isAppStateLoaded = true;
      } catch (err) {
        this.handleError(err, 'Failed to load application scheduling state.');
        this.appState = AppState.Closed;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Standardized error handling.
     * @param err - The error object.
     * @param fallback - The fallback error message.
     * @returns The error message.
     */
    handleError(err: any, fallback: string): string {
      const errorMessage = err?.message || (typeof err === 'string' ? err : fallback);
      this.error = errorMessage;

      return errorMessage;
    },

    startLoading() {
      this.loading = true;
      this.error = null;
    },
  },
});