<template>
  <v-card
    variant="flat"
    rounded="lg"
    class="bg-white mx-auto pa-6 pa-md-8 my-4"
    elevation="1"
    width="100%"
    color="background"
  >
    <div>
      <h2 class="text-h6 font-weight-bold text-primary">
        {{ name || 'Your Name' }}
      </h2>

      <blockquote 
        v-if="introduction"
        class="border-s-lg mt-2 border-opacity-100 pl-4 py-1 border-accent font-italic text-secondary text-body-1"
      >
        {{ introduction }}
      </blockquote>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  name?: string | null;
  introduction?: string | null;
}>();
</script>
