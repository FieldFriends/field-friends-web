<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-12 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="account-heading" tabindex="-1">
            Account Data
          </h1>

          <v-card class="bg-surface pa-6 mb-8" elevation="2" v-if="accountData">
            <h2 class="text-h5 font-weight-bold mb-6 text-primary border-bottom pb-2">Your Profile</h2>
            
            <v-row>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-subtitle-2 text-secondary mb-1 text-uppercase font-weight-bold tracking-wide">Gender Identity</div>
                <div class="text-body-1">{{ accountData.gender }}</div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-subtitle-2 text-secondary mb-1 text-uppercase font-weight-bold tracking-wide">Age</div>
                <div class="text-body-1">{{ accountData.age }}</div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-subtitle-2 text-secondary mb-1 text-uppercase font-weight-bold tracking-wide">University Affiliation</div>
                <div class="text-body-1">{{ accountData.affiliation }}</div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-subtitle-2 text-secondary mb-1 text-uppercase font-weight-bold tracking-wide">Social Energy</div>
                <div class="text-body-1">{{ accountData.social_energy }}</div>
              </v-col>
              <v-col cols="12" class="mb-2">
                <div class="text-subtitle-2 text-secondary mb-1 text-uppercase font-weight-bold tracking-wide">Submitted At</div>
                <div class="text-body-1">{{ new Date(accountData.submitted_at).toLocaleString() }}</div>
              </v-col>
            </v-row>
          </v-card>

          <v-card class="bg-surface pa-6 mb-8 text-center" elevation="2" v-else-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="my-4"></v-progress-circular>
            <p class="text-body-1 text-secondary">Loading your account data...</p>
          </v-card>

          <v-card class="bg-surface pa-6 mb-8 text-center" elevation="2" v-else-if="error">
            <v-icon icon="mdi-alert-circle-outline" color="secondary" size="large" class="mb-4"></v-icon>
            <p class="text-body-1 text-secondary mb-8">{{ error }}</p>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAccountData } from '@/services/endpoints/getAccountData';
import type { AccountDataResponse } from '#shared/schemas/accountDataSchema';

const accountData = ref<AccountDataResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    accountData.value = await getAccountData();
  } catch (err: any) {
    console.error('Failed to fetch account data:', err);
    error.value = err.message || 'Failed to load account data. You might not have submitted your profile yet.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.tracking-wide {
  letter-spacing: 0.05em;
}
.border-bottom {
  border-bottom: 1px solid rgba(var(--v-theme-secondary), 0.2);
}
</style>
