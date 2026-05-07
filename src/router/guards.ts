import { useAuthStore } from '@/stores/auth';
import { useSurveyStore } from '@/stores/survey';
import { useConfigStore } from '@/stores/config';
import { AppRoutes } from './routeConfig';
import { AppQueryParams } from '@shared/constants';
import type { RouteLocationNormalized } from 'vue-router';
import { hasUserSubmitted } from '@/utils/storeUtils';

/**
 * A helper function to determine if the user is authenticated.
 * @param authStore - The auth store.
 * @returns A promise that resolves to a boolean indicating if the user is authenticated.
 */
const isUserAuthenticated = async (authStore: ReturnType<typeof useAuthStore>): Promise<boolean> => {
  // FriendDev: Valid session means user is authenticated.
  if (authStore.session) {

    return true;
  }

  return await authStore.refreshSession();
};


/**
 * A helper function to ensure the app state is loaded without redundant API calls.
 * @param configStore - The config store.
 * @returns A promise that resolves when the app state is loaded.
 */
const ensureAppStateLoaded = async (configStore: ReturnType<typeof useConfigStore>): Promise<void> => {
  if (configStore.isAppStateLoaded) {
    return;
  }

  await configStore.fetchAppState();
};

/**
 * Navigation guard that requires the user to be authenticated.
 * @returns A promise that resolves to a redirect path if not authenticated, or void if authenticated.
 */
export const requireAuth = async (): Promise<string | void> => {
  const authStore = useAuthStore();
  const isAuthenticated = await isUserAuthenticated(authStore);

  if (!isAuthenticated) {
    return AppRoutes.Login.path;
  }
};

/**
 * Navigation guard that requires the user to be a guest.
 * @returns A promise that resolves to a redirect path if authenticated, or void if a guest.
 */
export const requireGuest = async (): Promise<string | void> => {
  const authStore = useAuthStore();
  const isAuthenticated = await isUserAuthenticated(authStore);

  if (!isAuthenticated) {
    return;
  }


  // FriendDev: The user is authenticated, so check if they've submitted.
  const surveyStore = useSurveyStore();
  const hasSubmitted = await hasUserSubmitted(surveyStore);

  if (hasSubmitted) {
    return AppRoutes.AlreadySubmitted.path;
  }

  return AppRoutes.Form.path;
};

/**
 * Navigation guard that requires the form to be open.
 * @param to - The route being navigated to.
 * @returns A promise that resolves to a redirect path if the form is closed, or void if open.
 */
export const requireFormOpen = async (to: RouteLocationNormalized): Promise<string | void> => {
  const configStore = useConfigStore();
  await ensureAppStateLoaded(configStore);

  // FriendDev: The form is open, so we don't need to do anything.
  if (configStore.isAcceptingResponses) {
    return;
  }

  return AppRoutes.Closed.path;
};

/**
 * Navigation guard that requires the form to be closed.
 * @returns A promise that resolves to a redirect path if the form is open, or void if closed.
 */
export const requireFormClosed = async (): Promise<string | void> => {
  const configStore = useConfigStore();
  // FriendDev: We need to wait for the app state to load before we can check anything.
  //            Otherwise checks always fail.
  await ensureAppStateLoaded(configStore);

  if (configStore.isAcceptingResponses) {
    return AppRoutes.Form.path;
  }
};

/**
 * Navigation guard that requires the user to have not submitted the form.
 * @param to - The route being navigated to.
 * @returns A promise that resolves to a redirect path if already submitted, or void if not submitted.
 */
export const requireNotSubmitted = async (to: RouteLocationNormalized): Promise<string | void> => {
  // FriendDev: Allow bypass if explicitly requesting a resubmission.
  if (to.query[AppQueryParams.Resubmit.key] === AppQueryParams.Resubmit.values.True) {
    return;
  }

  const surveyStore = useSurveyStore();
  const hasSubmitted = await hasUserSubmitted(surveyStore);

  if (hasSubmitted) {
    return AppRoutes.AlreadySubmitted.path;
  }
};

/**
 * Navigation guard that requires the user to have already submitted the form.
 * @returns A promise that resolves to a redirect path if not submitted, or void if submitted.
 */
export const requireSubmitted = async (): Promise<string | void> => {
  const surveyStore = useSurveyStore();
  const hasSubmitted = await hasUserSubmitted(surveyStore);

  if (!hasSubmitted) {
    return AppRoutes.Form.path;
  }
};
