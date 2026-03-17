import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { IAuthService } from './types/IAuthService';
import { SupabaseAuthEvents, SupabaseRoles } from '#shared/constants';
import { MockAuthDefaults } from '#shared/mock/mockConstants';

export class MockAuthService implements IAuthService {
  private fakeSession: Session | null = {
    access_token: MockAuthDefaults.AccessToken,
    refresh_token: MockAuthDefaults.RefreshToken,
    expires_in: MockAuthDefaults.ExpiresInSeconds,
    expires_at: Math.floor(Date.now() / 1000) + MockAuthDefaults.ExpiresInSeconds,
    token_type: MockAuthDefaults.AuthScheme,
    user: {
      id: MockAuthDefaults.UserId,
      aud: SupabaseRoles.Authenticated,
      role: SupabaseRoles.Authenticated,
      email: MockAuthDefaults.Email,
      app_metadata: {
        provider: 'email'
      },
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  private readonly listeners: Set<(event: AuthChangeEvent, session: Session | null) => void> = new Set();

  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    return { session: this.fakeSession, error: null };
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    this.listeners.add(callback);

    queueMicrotask(() => callback(SupabaseAuthEvents.InitialSession, this.fakeSession));

    return {
      unsubscribe: () => {
        this.listeners.delete(callback);
      },
    };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    this.fakeSession = null;
    this.listeners.forEach(callback => callback(SupabaseAuthEvents.SignedOut, null));

    return { error: null };
  }
}
