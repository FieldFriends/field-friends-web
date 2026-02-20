<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-sm-none"
  >
    <v-list nav>
      <v-list-item
        :to="AppRoutes.Home.path"
        prepend-icon="mdi-home"
        title="Home"
        @click="drawer = false"
      />
      <v-list-item
        :to="AppRoutes.About.path"
        prepend-icon="mdi-information"
        title="About"
        @click="drawer = false"
      />
      <v-list-item
        :to="AppRoutes.FAQ.path"
        prepend-icon="mdi-frequently-asked-questions"
        title="FAQ"
        @click="drawer = false"
      />
    </v-list>
  </v-navigation-drawer>

  <v-app-bar flat border class="px-2 px-md-4 bg-background">
    <v-app-bar-nav-icon
      variant="text"
      class="d-sm-none mr-2"
      @click.stop="drawer = !drawer"
    />

    <v-btn
      variant="text"
      :ripple="false"
      class="text-none font-weight-bold font-playfair px-0"
      color="primary"
      @click="router.push(AppRoutes.Home.path)"
    >
      Field Friends
    </v-btn>

    <v-spacer />

    <div class="d-none d-sm-flex align-center">
      <v-btn variant="text" :to="AppRoutes.Home.path" class="text-none">Home</v-btn>
      <v-btn variant="text" :to="AppRoutes.About.path" class="text-none">About</v-btn>
      <v-btn variant="text" :to="AppRoutes.FAQ.path" class="text-none">FAQ</v-btn>
    </div>

    <v-divider
      vertical
      inset
      class="mx-4 d-none d-sm-flex"
      style="height: 20px; margin-top: auto; margin-bottom: auto;"
    />

    <div v-if="isLoggedIn" class="d-flex align-center">
      <span class="text-caption text-medium-emphasis mr-3 d-none d-md-block">
        {{ userEmail }}
      </span>
      
      <v-btn
        variant="text"
        size="small"
        class="text-none"
        @click="handleLogout"
      >
        Logout
      </v-btn>
    </div>

    <div v-else>
      <v-btn
        color="primary"
        variant="flat"
        :to="AppRoutes.Login.path"
        class="text-none"
      >
        Sign up
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { AppRoutes } from '@/router/routeConfig';


const router = useRouter();
const route = useRoute();
const store = useAppStore();

const drawer = ref(false);

const isLoggedIn = computed(() => !!store.session);
const userEmail = computed(() => store.session?.user?.email || '');

async function handleLogout() {
  await store.signOut();
  router.push(AppRoutes.Home.path);
}
</script>

<style scoped>
/*
  By changing the active-class to 'unused-active-class', we prevent Vuetify
  from applying its default active styles (background overlay).
  We then manually apply 'nav-active-link' based on the route path.
*/

/* Target the content for the underline */
.nav-active-link :deep(.v-btn__content) {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Ensure no background overlay is shown even if the unused class triggers something */
.unused-active-class :deep(.v-btn__overlay) {
  opacity: 0 !important;
}
</style>