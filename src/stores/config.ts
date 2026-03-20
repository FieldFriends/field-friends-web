import { defineStore } from 'pinia';
import { AppState, type AppStateResponse } from '#shared/schemas/appStateSchema';
import { getAppState } from '@/services/endpoints/getAppState';
import { handleStoreError, startStoreLoading } from '@/stores/storeHelpers';

export const useConfigStore = defineStore('config', {
  state: () => ({
    appState: AppState.Closed,
    appStateDetails: null as AppStateResponse | null,
    isAppStateLoaded: false,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAppState() {
      this.startLoading();

      try {
        const data = await getAppState();

        this.appStateDetails = data;
        this.appState = data.currentState;
        this.isAppStateLoaded = true;
      } catch (err) {
        this.handleError(err, 'Failed to load application scheduling state.');
        this.appState = AppState.Closed;
      } finally {
        this.loading = false;
      }
    },

    handleError(err: any, fallback: string): string {
      return handleStoreError(this, err, fallback);
    },

    startLoading() {
      startStoreLoading(this);
    },
  },
});
