import type { RouterScrollBehavior } from 'vue-router';

/**
 * Handles the scroll behavior for the router.
 * @param to - The route being navigated to.
 * @param from - The route being navigated from.
 * @param savedPosition - The previous scroll position if available.
 * @returns The scroll position or a promise that resolves to the scroll position.
 */
export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }

  if (to.hash) {
    return new Promise((resolve) => {
      // FriendDev: Set a maximum loading time to avoid infinite loops.
      const startTime = Date.now();
      const maxWaitTime = 3000;

      const checkAndScroll = (): void => {
        // FriendDev: Get the element to scroll to.
        const el = document.getElementById(to.hash.substring(1));

        if (el) {
          // FriendDev: Scroll to the element.
          //            Add top offset to account for navbar.
          resolve({ el, top: 80, behavior: 'smooth' });

          return;
        }

        if (Date.now() - startTime < maxWaitTime) {
          // FriendDev: Wait for next frame and check again.
          requestAnimationFrame(checkAndScroll);

          return;
        }

        // FriendDev: Give up after maxWaitTime to avoid infinite loop.
        resolve({ top: 0 });
      };

      // FriendDev: Start checking for the element.
      requestAnimationFrame(checkAndScroll);
    });
  }

  // FriendDev: Default to top of the page.
  return { top: 0, behavior: 'instant' };
};
