<template>
  <v-tooltip text="Your responses will be saved directly to your device as a file." location="top">
    <template v-slot:activator="{ props }">
      <v-card
        v-bind="props"
        color="secondary"
        variant="tonal"
        rounded="lg"
        class="d-inline-flex align-center pa-1"
        elevation="0"
      >
        <v-btn
          variant="text"
          color="secondary"
          prepend-icon="mdi-download"
          @click="$emit('save')"
        >
          Save
        </v-btn>
        
        <v-divider vertical inset class="opacity-50 mx-1" color="secondary" />
        
        <v-btn
          variant="text"
          color="secondary"
          prepend-icon="mdi-upload"
          @click="$emit('load')"
        >
          Load
        </v-btn>
      </v-card>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
defineEmits<{
  save: [];
  load: [];
}>();
</script>
