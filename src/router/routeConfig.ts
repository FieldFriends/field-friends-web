export const AppRoutes = {
  Home: { name: 'Home', path: '/' },
  Login: { name: 'Login', path: '/login' },
  Form: { name: 'Form', path: '/form' },
  Submitted: { name: 'Submitted', path: '/submitted' },
  About: { name: 'About', path: '/about' },
  FAQ: { name: 'FAQ', path: '/faq' },
  NotFound: { name: 'NotFound', path: '/:pathMatch(.*)*' },
} as const;

export type AppRouteKeys = keyof typeof AppRoutes;