import { supabase } from '@/services/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

export const authService = {
  async getSession(): Promise<{ session: Session | null; error: any }> {
    const { data, error } = await supabase.auth.getSession();

    return { session: data.session, error };
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signOut() {
    return await supabase.auth.signOut();
  }
};