<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-sm-none bg-background"
  >
    <div class="px-4 py-4 d-flex align-center border-b justify-space-between">
      <span class="text-h6 font-weight-bold font-playfair text-primary">Field Friends</span>
    </div>

    <div v-if="isLoggedIn" class="px-4 py-3 border-b bg-primary-lighten-5 text-center">
      <div class="text-subtitle-2 font-weight-bold text-primary text-truncate mb-2">
        {{ userEmail }}
      </div>
      
      <v-divider class="mx-auto mb-2" width="170" />

      <router-link
        :to="AppRoutes.Account.path"
        class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center d-block text-decoration-none"
        @click="drawer = false"
      >
        Account
      </router-link>
      <router-link
        :to="AppRoutes.AlreadySubmitted.path"
        class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center d-block text-decoration-none"
        @click="drawer = false"
      >
        Sign-up Form
      </router-link>
    </div>

    <v-list nav class="pt-4">
      <v-list-item
        :to="AppRoutes.Home.path"
        active-color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center">
          Home
        </v-list-item-title>
      </v-list-item>
      
      <v-list-item
        :to="AppRoutes.About.path"
        active-color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center">
          About
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        :to="AppRoutes.FAQ.path"
        active-color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center">
          FAQ
        </v-list-item-title>
      </v-list-item>

      <v-divider class="my-2 mx-6" />

      <v-list-item
        :to="AppRoutes.Contact.path"
        active-color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center">
          Contact
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        :to="AppRoutes.Legal.path"
        active-color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-primary text-center">
          Legal
        </v-list-item-title>
      </v-list-item>

      <template v-if="isLoggedIn">
        <v-divider class="my-2 mx-6" />
        <v-list-item @click="handleLogout">
          <v-list-item-title class="text-h6 py-2 font-dm-sans font-weight-bold text-secondary text-center">
            Log out
          </v-list-item-title>
        </v-list-item>
      </template>
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
      <v-divider
        vertical
        inset
        class="mx-2 d-none d-sm-flex"
      />
      <v-btn variant="text" :to="AppRoutes.Contact.path" class="text-none">Contact</v-btn>
      <v-btn variant="text" :to="AppRoutes.Legal.path" class="text-none">Legal</v-btn>
    </div>

    <v-divider
      vertical
      inset
      class="mx-4 d-none d-sm-flex"
    />

    <div v-if="isLoggedIn" class="d-flex align-center">
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            size="small"
            class="font-dm-sans font-weight-bold text-primary mr-1 d-none d-sm-inline-flex"
            v-bind="props"
          >
            {{ userEmail }}

            <template #append>
              <v-icon icon="mdi-chevron-down" />
            </template>
          </v-btn>
        </template>
        <v-list min-width="150">
          <v-list-item :to="AppRoutes.Account.path">
            <v-list-item-title class="text-primary font-weight-bold font-dm-sans">
              Account
            </v-list-item-title>
          </v-list-item>

          <v-list-item :to="AppRoutes.AlreadySubmitted.path">
            <v-list-item-title class="text-primary font-weight-bold font-dm-sans">
              Sign-up Form
            </v-list-item-title>
          </v-list-item>
          
          <v-divider class="mx-4" />
          
          <v-list-item @click="handleLogout">
            <v-list-item-title class="font-weight-bold text-secondary font-dm-sans">
              Log out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
import { useAuthStore } from '@/stores/auth';
import { AppRoutes } from '@/router/routeConfig';


const router = useRouter();
const route = useRoute();
const store = useAuthStore();

const drawer = ref(false);

const isLoggedIn = computed(() => !!store.session);
const userEmail = computed(() => store.session?.user?.email || '');

async function handleLogout() {
  await store.signOut();

  location.assign(AppRoutes.Home.path);
}
</script>

<style scoped>
.nav-active-link :deep(.v-btn__content) {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.unused-active-class :deep(.v-btn__overlay) {
  opacity: 0 !important;
}
</style>