import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { AuthSubscription } from './AuthSubscription';
import type { AuthResponse } from './AuthResponse';

export interface IAuthService {
  getSession(): Promise<AuthResponse>;

  signIn(email: string, code: string): Promise<AuthResponse>;

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): AuthSubscription;

  signOut(): Promise<{ error: AuthError | null }>;
}
