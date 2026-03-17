import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { AuthSubscription } from './AuthSubscription';

// TODO @FriendDev Add sign in
export interface IAuthService {
  getSession(): Promise<{ session: Session | null; error: AuthError | null }>;

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): AuthSubscription;

  signOut(): Promise<{ error: AuthError | null }>;
}
