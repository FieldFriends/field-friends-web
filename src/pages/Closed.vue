<template>
  <v-container class="fill-height justify-center text-center">
    <div class="w-100 d-flex flex-column align-center">
      
      <template v-if="matchingClosed">
        <h1 class="text-h4 font-weight-bold mb-8 text-primary">
          We're not currently accepting responses right now.
        </h1>
        <template v-if="getWindowStartDateString">
          <p class="text-body-1 text-secondary mb-6">
            Our next matching window opens on <span class="font-weight-bold">{{ getWindowStartDateString }}</span>.
          </p>
        </template>
        <template v-else>
          <p class="text-body-1 text-secondary mb-6">
            We'll announce the date of our next matching window soon!
          </p>
        </template>
      </template>
      <template v-else-if="appPaused">
        <h1 class="text-h4 font-weight-bold mb-8 text-primary">
          Field Friends is currently paused.
        </h1>
        <p class="text-body-1 text-secondary mb-6">
          We hope to be back soon!
        </p>
      </template>
      <template v-else>
        <!-- FriendDev: This code should never run. We'll have a route guard in place. -->
        <h1 class="text-h4 font-weight-bold mb-8 text-primary">
          The sign-up form is currently open!
        </h1>
        <p class="text-body-1 text-secondary mb-6">
          Sign-ups will close on <span class="font-weight-bold">{{ getWindowEndDateString }}</span>.
        </p>
      </template>

    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { AppState } from '@shared/schemas/appStateSchema';
import { useConfigStore } from '@/stores/config';
import { useWindowDates } from '@/composables/useWindowDates';

const configStore = useConfigStore();

const matchingClosed = computed(() => {
  return configStore.matchingClosed;
});

const appPaused = computed(() => {
  return configStore.appState === AppState.Paused;
});

const { getWindowStartDateTimeString: getWindowStartDateString, getWindowEndDateTimeString: getWindowEndDateString } = useWindowDates();
</script>