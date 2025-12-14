import { defineStore } from 'pinia';
import { supabase } from '@/services/supabase';
import type { Session } from '@supabase/supabase-js';
import type { ProfileSubmission } from '@/types/schema';

export const useAppStore = defineStore('app', {
  state: () => ({
    session: null as Session | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // FriendDev: Init auth to get our JWT.
    async initAuth() {
      const { data } = await supabase.auth.getSession();

      this.session = data.session;

      supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
      });
    },

    //! TODO: Make this force refresh the access token before submit in case the user was idle/stale token.
    async submitSurvey(formData: ProfileSubmission) {
      if (!this.session) {
        this.error = 'You must have an active session to submit.';
        return false;
      }

      this.loading = true;
      this.error = null;

      try {

        // FriendDev: Post to backend for verification.
        const response = await fetch('/api/submit-survey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.session.access_token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.error || 'Submission failed');
        }

        return true;
      } catch (err: any) {
        console.error(err);
        this.error = err.message || 'An unexpected error occurred.';
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
});