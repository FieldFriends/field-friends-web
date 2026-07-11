<template>
  <v-row justify="center" class="w-100 mb-12 text-center">
    <v-col cols="12" md="10" lg="8">
      <!-- Loading State -->
      <template v-if="configStore.loading || !configStore.isAppStateLoaded">
         <v-skeleton-loader type="paragraph" />
      </template>

      <!-- App State: Open -->
      <template v-else-if="appState === AppState.Open">
        <h2 class="text-h4 font-weight-bold mb-4 text-primary">
          The sign-up form is currently open!
        </h2>
        <p class="text-body-1 text-secondary">
          Sign-ups will close on <span class="font-weight-bold">{{ getWindowEndDateString }}</span>.
        </p>
        <p class="text-body-1 text-secondary mt-2">
          Matches will be sent out on <span class="font-weight-bold">{{ getMatchDateString }}</span>.
        </p>
      </template>

      <!-- App State: Scheduled -->
      <template v-else-if="appState === AppState.Scheduled">
        <h2 class="text-h4 font-weight-bold mb-4 text-primary">
          Matching opens soon!
        </h2>
        <p class="text-body-1 text-secondary">
          Our next matching window opens on <span class="font-weight-bold">{{ getWindowStartDateString }}</span>.
        </p>
      </template>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@/stores/config';
import { AppState } from '@shared/schemas/appStateSchema';
import { useWindowDates } from '@/composables/useWindowDates';
import { computed } from 'vue';

const configStore = useConfigStore();

const appState = computed(() => configStore.appState);

const { getWindowStartDateTimeString: getWindowStartDateString, getWindowEndDateTimeString: getWindowEndDateString, getMatchDateString } = useWindowDates();
</script>