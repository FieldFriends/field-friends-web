<template>
  <v-card
    variant="flat"
    rounded="lg"
    class="bg-white mx-auto pa-6 pa-md-8 my-4"
    elevation="0"
    width="100%"
    color="background"
    border
  >
    <div>
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <h2 class="text-h6 font-weight-bold font-dm-sans text-primary">
          {{ name || 'Your Name' }}
        </h2>
        
        <v-divider
          vertical
          class="mx-3 my-2 d-none d-sm-block"
          color="secondary"
          opacity="0.3"
          thickness="2"
        />
        
        <span class="text-body-2 text-accent mt-1 mt-sm-0">
          {{ email || 'your-email@illinois.edu' }}
        </span>
      </div>

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
  email?: string | null;
  introduction?: string | null;
}>();
</script>
