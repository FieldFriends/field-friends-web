<template>
  <v-container class="submitted-page fill-height justify-center text-center">
    <div class="submitted-page__content d-flex flex-column align-center">
      <h1 class="text-h3 font-weight-bold mb-6 text-primary">
        You're all set.
      </h1>

      <div class="text-body-1 text-secondary mb-8">
        We've received your submission
      </div>
      
      <p class="text-h6 font-weight-regular font-eb-garamond text-primary mb-0">
        You'll receive an email with your group on <strong>{{ matchDate }}</strong>!
      </p>

      <p class="text-secondary font-italic mt-12">
        All of your data in Field Friends will be permanently deleted on {{ matchDate }}
      </p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
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