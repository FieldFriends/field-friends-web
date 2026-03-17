import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { IAuthService } from './types/IAuthService';
import type { AuthResponse } from './types/AuthResponse';
import { SupabaseAuthEvents, SupabaseRoles, HttpStatusCodes } from '#shared/constants';
import { MockAuthDefaults } from '#shared/mock/mockAuthDefaults';

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

  async getSession(): Promise<AuthResponse> {
    return { session: this.fakeSession, error: null };
  }

  async signIn(email: string, code: string): Promise<AuthResponse> {
    if (code === MockAuthDefaults.OtpCode) {
      queueMicrotask(() => {
        this.listeners.forEach(callback => callback(SupabaseAuthEvents.SignedIn, this.fakeSession));
      });
      return { session: this.fakeSession, error: null };
    }

    return {
      session: null,
      error: {
        name: 'AuthError',
        message: 'Invalid OTP code.',
        status: HttpStatusCodes.BadRequest
      } as AuthError
    };
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
