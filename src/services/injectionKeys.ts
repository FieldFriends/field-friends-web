import type { InjectionKey } from 'vue';
import type { IAuthService } from './auth/types/IAuthService';

export const AUTH_SERVICE_KEY: InjectionKey<IAuthService> = Symbol('AUTH_SERVICE_KEY');
