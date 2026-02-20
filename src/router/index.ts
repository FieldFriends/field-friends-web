/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import Index from '@/pages/index.vue';
import { useAppStore } from '@/stores/app';
import About from '@/pages/About.vue';
import FAQ from '@/pages/FAQ.vue';
import { AppRoutes } from './routeConfig';

const routes = [
  {
    path: AppRoutes.Home.path,
    name: AppRoutes.Home.name,
    component: Index,
    meta: { requiresAuth: false },
  },
  {
    path: AppRoutes.About.path,
    name: AppRoutes.About.name,
    component: About,
    meta: { requiresAuth: false },
  },
  {
    path: AppRoutes.FAQ.path,
    name: AppRoutes.FAQ.name,
    component: FAQ,
    meta: { requiresAuth: false },
  },
  {
    path: AppRoutes.Login.path,
    name: AppRoutes.Login.name,
    // FriendDev: Lazy load the login page so it doesn't slow down the homepage load
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: AppRoutes.Submitted.path,
    name: AppRoutes.Submitted.name,
    component: () => import('@/pages/Submitted.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: AppRoutes.Form.path,
    name: AppRoutes.Form.name,
    component: () => import('@/pages/SignUpForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    // FriendDev: 404 Catch-all route
    path: AppRoutes.NotFound.path,
    name: AppRoutes.NotFound.name,
    component: () => import('@/pages/NotFound.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// FriendDev: Convenience frontend route guard.
//            Note: this provides no actual security, so we still
//            verify every request on the backend.
router.beforeEach(async (to, from, next) => {
  const store = useAppStore();

  if (to.meta.requiresAuth) {
    // FriendDev: The store is reset on page refresh.
    //            Attempt to restore the session.
    if (!store.session) {
      const isValidSession = await store.refreshSession();

      if (!isValidSession) {
        // FriendDev: Invalid, send to login.
        next(AppRoutes.Login.path)
        return;
      }
    }

    // FriendDev: Already valid.
    next();
  } else {
    // FriendDev: Route does not require auth.
    next();
  }
});


// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err);
    } else {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
});

export default router;
