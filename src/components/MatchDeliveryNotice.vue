<template>
  <p class="text-body-2 text-secondary mt-4 text-center">
    <template v-if="props.isLoading">
      <v-skeleton-loader type="text" class="mx-auto" width="300" />
    </template>
    <template v-else>
      Your matches will be sent to <strong>{{ props.userEmail || 'your email address' }}</strong> and your Field Friends account will be deleted on <strong>{{ props.matchDateString }}</strong>.
    </template>
  </p>
</template>

<script setup lang="ts">
type Props = {
  isLoading: boolean;
  userEmail?: string | null;
  matchDateString: string | null;
};

const props = defineProps<Props>();
</script>
