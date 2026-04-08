<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useConfigStore } from '@/stores/config';

const authStore = useAuthStore();
const configStore = useConfigStore();

onMounted(() => {
  authStore.initAuth();
  configStore.fetchAppState();
});
</script>