<template>
  <div class="d-flex flex-column fill-height">
    <app-header />
    
    <v-main class="flex-grow-1">
      <router-view />
    </v-main>
    
    <app-footer />
  </div>
</template>