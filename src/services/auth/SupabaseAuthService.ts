import { supabase } from '@/services/supabase';
import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { IAuthService } from './types/IAuthService';
import type { AuthSubscription } from './types/AuthSubscription';

export class SupabaseAuthService implements IAuthService {
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): AuthSubscription {
    const { data } = supabase.auth.onAuthStateChange(callback);

    return {
      unsubscribe: () => data.subscription.unsubscribe(),
    };
  }

  async signOut() {
    return await supabase.auth.signOut();
  }
}
