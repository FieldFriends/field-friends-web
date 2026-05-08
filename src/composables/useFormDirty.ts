import type { FriendFormState } from '@/types/friendFormState';
import { INITIAL_FORM_STATE } from '@/types/friendFormState';

/**
 * Check whether a single field value differs from its initial value.
 * @param current - The current field value.
 * @param initial - The initial/default field value.
 */
function isFieldDirty(current: unknown, initial: unknown): boolean {
  if (typeof current === 'string') {
    return current.trim() !== (initial as string);
  }

  if (Array.isArray(current)) {
    return current.length > 0;
  }

  return current !== initial;
}

/**
 * Determine whether any field in the form differs from its initial state.
 * @param form - The reactive form state to check.
 */
export function isFormDirty(form: FriendFormState): boolean {

  // FriendDev: Check if any field has been modified.
  return (Object.keys(INITIAL_FORM_STATE) as Array<keyof FriendFormState>).some((key) => {
    return isFieldDirty(form[key], INITIAL_FORM_STATE[key]);
  });
}

/**
 * Composable that manages "unsaved changes" guards for a form page.
 *
 * Registers both a native `beforeunload` listener (browser tab close / refresh)
 * and a Vue Router `onBeforeRouteLeave`.
 *
 * Call `suppressNextGuard()` before any programmatic navigation that should
 * bypass the guard (e.g. after a successful submit or an import).
 *
 * @param form - The reactive form state to track.
 */
export function useFormDirty(form: FriendFormState) {
  const suppressed = ref(false);

  const isDirty = computed(() => isFormDirty(form));

  /**
   * Mark the next guard check as suppressed.
   * Use before programmatic navigation that should not trigger a confirm.
   */
  function suppressNextGuard(): void {
    suppressed.value = true;
  }

  /**
   * Determine whether the guard should block navigation.
   * Consumes the suppression flag if set.
   */
  function shouldBlock(): boolean {
    if (suppressed.value) {
      suppressed.value = false;
      return false;
    }

    return isDirty.value;
  }

  /**
   * Native beforeunload handler.
   * @param event - The BeforeUnloadEvent.
   */
  function onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!shouldBlock()) {
      return;
    }

    event.preventDefault();
  }

  /**
   * Register the Vue Router in-component leave guard.
   * Must be called during component setup (synchronous).
   */
  function useLeaveGuard(): void {
    onBeforeRouteLeave(() => {
      if (!shouldBlock()) {
        return;
      }

      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );

      if (!confirmed) {
        return false;
      }
    });
  }

  onMounted(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeunload', onBeforeUnload);
  });

  return {
    isDirty,
    suppressNextGuard,
    useLeaveGuard,
  };
}
