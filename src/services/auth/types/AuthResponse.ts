import type { Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  session: Session | null;
  error: AuthError | null;
}
