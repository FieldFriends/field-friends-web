import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { IAuthService } from './auth/types/IAuthService';
import type { AuthSubscription } from './auth/types/AuthSubscription';
import type { AuthResponse } from './auth/types/AuthResponse';

class AuthServiceProxy implements IAuthService {
  private adapter!: IAuthService;

  setAdapter(newAdapter: IAuthService) {
    this.adapter = newAdapter;
  }

  async getSession(): Promise<AuthResponse> {
    return this.adapter.getSession();
  }

  async signIn(email: string, code: string): Promise<AuthResponse> {
    return this.adapter.signIn(email, code);
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): AuthSubscription {
    return this.adapter.onAuthStateChange(callback);
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    return this.adapter.signOut();
  }
}

export const authService = new AuthServiceProxy();