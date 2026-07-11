<template>
  <v-container class="submitted-page fill-height justify-center text-center">
    <div class="submitted-page__content w-100 d-flex flex-column align-center">
      <h1 class="text-h2 font-weight-bold mb-8 text-primary">
        You're all set.
      </h1>
      
      <p class="text-h5 font-weight-regular font-eb-garamond text-secondary mb-12">
        <template v-if="configStore.loading || !configStore.isAppStateLoaded">
          <v-skeleton-loader type="paragraph" class="mx-auto" width="400" />
        </template>
        <template v-else>
          You'll receive an email with your group by <strong>{{ getMatchDateString }}</strong>.
        </template>
      </p>

      <v-divider class="w-100 mb-12 border-opacity-25" color="secondary" />

      <router-link
        :to="AppRoutes.Account.path"
        class="text-decoration-none font-weight-bold font-dm-sans text-link d-inline-flex align-center text-h6 mb-16"
      >
        View your submission
        <v-icon
          icon="mdi-arrow-right"
          size="small"
          class="ms-2"
        />
      </router-link>

      <match-delivery-notice
        :is-loading="configStore.loading || !configStore.isAppStateLoaded"
        :user-email="userEmail"
        :match-date-string="getMatchDateString"
      />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { AppRoutes } from '@/router/routeConfig';
import { useWindowDates } from '@/composables/useWindowDates';
import { useConfigStore } from '@/stores/config';
import { useAuthStore } from '@/stores/auth';
import MatchDeliveryNotice from '@/components/MatchDeliveryNotice.vue';

const authStore = useAuthStore();
const userEmail = computed(() => authStore.session?.user?.email || '');
const configStore = useConfigStore();
const { getMatchDateString } = useWindowDates();
</script>

<style scoped lang="scss">
.submitted-page {
  &__content {
    max-width: 580px;
  }
}
</style>