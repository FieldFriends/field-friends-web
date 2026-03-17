<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-12 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-8 text-primary mt-md-8 text-center" id="account-heading" tabindex="-1">
            Account Data
          </h1>

          <div v-if="accountData">
            <v-divider class="mb-12 border-opacity-25" color="secondary" aria-hidden="true" />

            <section class="mb-12" aria-labelledby="submission-heading">
              <h2 id="submission-heading" class="text-h4 font-weight-bold mb-4 text-primary">
                Your Submission
              </h2>
              <p class="text-h6 text-secondary font-italic font-eb-garamond mb-8">
                For this round
              </p>
              
              <div class="pl-0 pl-md-4">
                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-playfair">Gender Identity</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(GENDER_OPTIONS, accountData.gender) }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-playfair">Age</h3>
                  <p class="text-body-1 text-secondary page-text">{{ accountData.age }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-playfair">University Affiliation</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(AFFILIATION_OPTIONS, accountData.affiliation) }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-playfair">Social Pace &amp; Preferences</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(SOCIAL_ENERGY_OPTIONS, accountData.social_energy) }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-playfair">Submitted At</h3>
                  <p class="text-body-1 text-secondary page-text">{{ new Date(accountData.submitted_at).toLocaleString() }}</p>
                </div>
              </div>
            </section>
          </div>

          <div class="text-center mt-12 mb-12" v-else-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="my-4"></v-progress-circular>
            <p class="text-body-1 text-secondary font-italic font-eb-garamond">Loading your account data...</p>
          </div>

          <div class="text-center mt-12 mb-12" v-else-if="error">
            <v-icon icon="mdi-alert-circle-outline" color="secondary" size="large" class="mb-4"></v-icon>
            <p class="text-body-1 text-secondary mb-8">{{ error }}</p>
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAccountData } from '@/services/endpoints/getAccountData';
import type { AccountDataResponse } from '#shared/schemas/accountDataSchema';
import { SOCIAL_ENERGY_OPTIONS, AFFILIATION_OPTIONS, GENDER_OPTIONS } from '#shared/friendConfig';

const accountData = ref<AccountDataResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const getLabel = (options: readonly { label: string, value: string }[], value: string) => {
  return options.find(o => o.value === value)?.label || value;
};

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
