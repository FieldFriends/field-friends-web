<template>
  <v-container class="fill-height justify-center text-center">
    <div class="w-100 d-flex flex-column align-center">
      <h1 class="text-h4 font-weight-bold mb-8 text-primary">
        It looks like you've already submitted!
      </h1>

      <router-link
        :to="AppRoutes.Account.path"
        class="text-decoration-none font-weight-bold font-dm-sans text-link d-inline-flex align-center text-h6 mb-12"
      >
        View your submission
        <v-icon
          icon="mdi-arrow-right"
          size="small"
          class="ms-2"
        />
      </router-link>

      <template v-if="configStore.isAcceptingResponses">
        <v-divider thickness="2" :length="512" color="primary" class="mx-6" />

        <div class="text-center w-100 pt-8">
          <p class="text-body-1 text-secondary mb-6">
            Want to change your answers?
          </p>
          <v-btn
            :to="AppRoutes.Form.withResubmit()"
            color="primary"
            variant="flat"
            class="px-9 text-none"
          >
            Resubmit
          </v-btn>
        </div>
      </template>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { AppRoutes } from '@/router/routeConfig';
import { useConfigStore } from '@/stores/config';

const configStore = useConfigStore();
</script>