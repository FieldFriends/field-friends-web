import type { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import type { IAuthService } from './types/IAuthService';
import type { AuthResponse } from './types/AuthResponse';
import { SupabaseAuthEvents, SupabaseRoles, HttpStatusCodes } from '#shared/constants';
import { MockAuthDefaults } from '#shared/mock/mockAuthDefaults';

export class MockAuthService implements IAuthService {
  private fakeSession: Session | null = null;
  private readonly STORAGE_KEY = 'mock_auth_session';

  private readonly listeners: Set<(event: AuthChangeEvent, session: Session | null) => void> = new Set();

  constructor() {
    const storedSession = localStorage.getItem(this.STORAGE_KEY);

    if (storedSession) {
      try {
        this.fakeSession = JSON.parse(storedSession);
      } catch (e) {
        console.error('Failed to parse mock session', e);
      }
    }
  }

  async getSession(): Promise<AuthResponse> {
    return { session: this.fakeSession, error: null };
  }

  async signIn(email: string, code: string): Promise<AuthResponse> {
    if (email !== MockAuthDefaults.Email || code !== MockAuthDefaults.OtpCode) {
      return {
        session: null,
        error: {
          name: 'AuthError',
          message: 'Invalid credentials.',
          status: HttpStatusCodes.BadRequest
        } as AuthError
      };
    }

    this.fakeSession = {
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

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.fakeSession));

    queueMicrotask(() => {
      this.listeners.forEach(callback => callback(SupabaseAuthEvents.SignedIn, this.fakeSession));
    });

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
    localStorage.removeItem(this.STORAGE_KEY);
    this.listeners.forEach(callback => callback(SupabaseAuthEvents.SignedOut, null));

    return { error: null };
  }
}
