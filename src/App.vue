<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

onMounted(() => {
  store.initAuth();
});
</script>