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
  // FriendDev: We init auth here rather than a Router Guard.
  //            This allows Supabase to parse the URL hash without blocking navigation.
  // TODO: If we need stricter UX later, consider handling the "loading" state here to prevent content flash.
  store.initAuth();
});
</script>