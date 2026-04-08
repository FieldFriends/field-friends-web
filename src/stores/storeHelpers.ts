/**
 * Shared helpers for Pinia stores that track loading/error state.
 */

export interface StoreErrorState {
  loading: boolean;
  error: string | null;
}

/**
 * Standardized error handling.
 * @param state - The store's reactive state (pass `this` from a Pinia action).
 * @param err - The error object.
 * @param fallback - The fallback error message.
 * @returns The resolved error message.
 */
export function handleStoreError(state: StoreErrorState, err: any, fallback: string): string {
  const errorMessage = err?.message || (typeof err === 'string' ? err : fallback);
  state.error = errorMessage;

  return errorMessage;
}

/**
 * Reset error and set loading to true.
 * @param state - The store's reactive state (pass `this` from a Pinia action).
 */
export function startStoreLoading(state: StoreErrorState): void {
  state.loading = true;
  state.error = null;
}
