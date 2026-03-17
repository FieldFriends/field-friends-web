<template>
  <v-container class="submitted-page fill-height justify-center text-center">
    <div class="submitted-page__content w-100 d-flex flex-column align-center">
      <h1 class="text-h2 font-weight-bold mb-8 text-primary">
        You're all set.
      </h1>
      
      <p class="text-h5 font-weight-regular font-eb-garamond text-secondary mb-12">
        You'll receive an email with your group on <strong>{{ matchDate }}</strong>.
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

      <p class="text-body-2 text-secondary font-italic mt-4">
        All of your data in Field Friends will be permanently deleted on {{ matchDate }}
      </p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { AppRoutes } from '@/router/routeConfig';
import { computed } from 'vue';

// TODO @FriendDev CRITICAL
const matchDate = computed(() => {
  return "Sunday, October 22nd";
});
</script>

<style scoped lang="scss">
.submitted-page {
  &__content {
    max-width: 580px;
  }
}
</style>