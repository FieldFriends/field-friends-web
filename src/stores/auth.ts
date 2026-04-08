import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import { handleStoreError, startStoreLoading } from '@/stores/storeHelpers';
import type { Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as Session | null,
    loading: false,
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
      } catch (err) {
        this.handleError(err, 'Failed to sign out.');
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
