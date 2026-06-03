import 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import type { RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import { AppRoutes } from './routeConfig';
import {
  requireAuth,
  requireGuest,
  requireFormOpen,
  requireFormClosed,
  requireNotSubmitted,
  requireSubmitted,
} from './guards';

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutes.Home.path,
    name: AppRoutes.Home.name,
    component: Home,
  },
  {
    path: AppRoutes.About.path,
    name: AppRoutes.About.name,
    component: () => import('@/pages/About.vue'),
  },
  {
    path: AppRoutes.FAQ.path,
    name: AppRoutes.FAQ.name,
    component: () => import('@/pages/FAQ.vue'),
  },
  {
    path: AppRoutes.Legal.path,
    name: AppRoutes.Legal.name,
    component: () => import('@/pages/Legal.vue'),
  },
  {
    path: AppRoutes.Contact.path,
    name: AppRoutes.Contact.name,
    component: () => import('@/pages/Contact.vue'),
  },
  {
    path: AppRoutes.Account.path,
    name: AppRoutes.Account.name,
    component: () => import('@/pages/Account.vue'),
    beforeEnter: [requireAuth],
  },
  {
    path: AppRoutes.AlreadySubmitted.path,
    name: AppRoutes.AlreadySubmitted.name,
    component: () => import('@/pages/AlreadySubmitted.vue'),
    beforeEnter: [requireAuth, requireSubmitted],
  },
  {
    path: AppRoutes.Login.path,
    name: AppRoutes.Login.name,
    // FriendDev: Lazy load the login page so it doesn't slow down the homepage load.
    component: () => import('@/pages/Login.vue'),
    beforeEnter: [requireGuest],
  },
  {
    path: AppRoutes.Submitted.path,
    name: AppRoutes.Submitted.name,
    component: () => import('@/pages/Submitted.vue'),
    beforeEnter: [requireAuth, requireFormOpen, requireSubmitted],
  },
  {
    path: AppRoutes.Form.path,
    name: AppRoutes.Form.name,
    component: () => import('@/pages/SignUpForm.vue'),
    beforeEnter: [requireAuth, requireFormOpen, requireNotSubmitted],
  },
  {
    path: AppRoutes.Closed.path,
    name: AppRoutes.Closed.name,
    component: () => import('@/pages/Closed.vue'),
    beforeEnter: [requireFormClosed],
  },
  {
    path: AppRoutes.Unsubscribe.path,
    name: AppRoutes.Unsubscribe.name,
    component: () => import('@/pages/Unsubscribe.vue'),
  },
  {
    // FriendDev: 404 catch-all.
    path: AppRoutes.NotFound.path,
    name: AppRoutes.NotFound.name,
    component: () => import('@/pages/NotFound.vue'),
  },
];

export default setupLayouts(routes);
