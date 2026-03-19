/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import '@/styles/global.scss'
import { authService } from '@/services/authService'

import { AUTH_SERVICE_KEY } from '@/services/injectionKeys'

try {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
    // FriendDev: Waiting to import until here will allow this code to never get deployed to production.
    const { worker } = await import('./mocks/browser');

    await worker.start({ onUnhandledRequest: 'bypass' });

    const { MockAuthService } = await import('./services/auth/MockAuthService');
    authService.setAdapter(new MockAuthService());
  } else {
    const { SupabaseAuthService } = await import('./services/auth/SupabaseAuthService');
    authService.setAdapter(new SupabaseAuthService());
  }

  const app = createApp(App);

  app.provide(AUTH_SERVICE_KEY, authService);

  registerPlugins(app);

  app.mount('#app');
} catch (err) {
  console.error(err);
}
