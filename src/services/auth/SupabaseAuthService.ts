import { supabase } from '@/services/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { IAuthService } from './types/IAuthService';
import type { AuthSubscription } from './types/AuthSubscription';
import type { AuthResponse } from './types/AuthResponse';

export class SupabaseAuthService implements IAuthService {
  async getSession(): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  }

  async signIn(email: string, code: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    return {
      session: data.session,
      error
    };
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
