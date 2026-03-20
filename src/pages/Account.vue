<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-4 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div v-if="accountData" class="mt-md-4">

            <section class="mb-12" aria-labelledby="submission-heading">
              <h1 id="submission-heading" class="text-h4 font-weight-bold mb-1 text-primary">
                Your Submission
              </h1>
              <p class="text-h6 text-secondary font-italic font-eb-garamond mb-6">
                For this round
              </p>
              
              <div class="mb-2">
                <p class="text-body-1 font-weight-bold text-primary font-dm-sans">{{ userEmail }}</p>
              </div>

              <v-divider class="mb-4 mt-0 pt-0 border-opacity-25" color="secondary" aria-hidden="true" />

              <div class="pl-0 pl-md-4">
                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-dm-sans">Gender Identity</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(GENDER_OPTIONS, accountData.gender) }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-dm-sans">Age</h3>
                  <p class="text-body-1 text-secondary page-text">{{ accountData.age }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-dm-sans">University Affiliation</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(AFFILIATION_OPTIONS, accountData.affiliation) }}</p>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-dm-sans">Social Pace &amp; Preferences</h3>
                  <p class="text-body-1 text-secondary page-text">{{ getLabel(SOCIAL_ENERGY_OPTIONS, accountData.social_energy) }}</p>
                </div>

                <div class="mb-0 pb-0">
                  <h3 class="text-h6 font-weight-bold mb-2 text-primary font-dm-sans">Submitted At</h3>
                  <p class="text-body-1 text-secondary page-text">{{ new Date(accountData.submitted_at).toLocaleString() }}</p>
                </div>
              </div>
            </section>
          </div>

          <div class="text-center mt-12 mb-12" v-else-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="my-4"></v-progress-circular>
            <p class="text-body-1 text-secondary font-italic font-eb-garamond">Loading your account data...</p>
          </div>

          <div v-else-if="error" class="text-center mt-12 mb-12">
            <v-icon icon="mdi-alert-circle-outline" color="secondary" size="large" class="mb-4"></v-icon>
            <p class="text-body-1 text-secondary mb-8">{{ error }}</p>
          </div>

          <div class="text-center mt-0 pt-8 border-t border-opacity-25" v-if="!isLoading">
            <p class="text-body-1 text-secondary mb-4">
              Want to change your answers?
            </p>
            <v-btn
              :to="AppRoutes.Form.path"
              color="primary"
              variant="flat"
              class="px-9 text-none mb-8"
            >
              Resubmit
            </v-btn>

            <v-divider class="mb-8 mx-16 border-opacity-25" color="secondary" />

            <v-btn
              color="error"
              variant="outlined"
              class="px-9 text-none"
              @click="showDeleteModal = true"
            >
              Delete Account
            </v-btn>
          </div>
        </v-col>

        
      </v-row>
    </v-container>

    <v-dialog
      v-model="showDeleteModal"
      :max-width="mobile ? undefined : 500"
      :fullscreen="mobile"
      :transition="mobile ? 'dialog-bottom-transition' : 'dialog-transition'"
    >
      <v-card :class="['bg-background', mobile ? 'h-100 d-flex flex-column' : '']">
        <v-card-title :class="['text-h5 font-weight-bold text-primary bg-error-lighten-5 pa-4', { 'pt-8': mobile }]">
          Delete Account
        </v-card-title>
        <v-card-text :class="['pa-4 px-6 text-body-1 text-secondary mb-2', mobile ? 'flex-grow-1 pt-6' : '']">
          <p>
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <p class="mt-4">
            <strong>
              All of your data, including your form responses, will be permanently deleted.
              This also withdraws you from any ongoing matching rounds.
            </strong>
          </p>
          <p class="mt-4 text-caption">
            Note: You can always sign up again during any open matching window.
          </p>
        </v-card-text>

        <v-divider class="mb-4" thickness="2" color="primary" />

        <v-card-actions :class="['pa-4', mobile ? 'd-flex flex-column-reverse align-stretch pb-8' : 'pt-0']">

          <v-btn
            :color="mobile ? 'primary' : 'secondary'"
            :variant="mobile ? 'outlined' : 'text'"
            @click="showDeleteModal = false"
            :disabled="isDeleting"
            :block="mobile"
          >
            Cancel
          </v-btn>

          <v-spacer v-if="!mobile" />
          
          <v-btn
            color="error"
            variant="flat"
            @click="deleteAccount"
            :loading="isDeleting"
            :class="[mobile ? 'mb-2' : 'px-6']"
            :block="mobile"
          >
            Yes, delete my account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.isVisible"
      :color="snackbar.color"
      location="top center"
      timeout="5000"
      class="mb-6"
    >
      <div class="font-weight-bold font-dm-sans">
        {{ snackbar.message }}
      </div>
      <template #actions>
        <v-btn icon="mdi-close" variant="text" color="white" @click="snackbar.isVisible = false" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAccountData } from '@/services/endpoints/getAccountData';
import { deleteAccountRequest } from '@/services/endpoints/deleteAccountRequest';
import type { AccountDataResponse } from '#shared/schemas/accountDataSchema';
import { SOCIAL_ENERGY_OPTIONS, AFFILIATION_OPTIONS, GENDER_OPTIONS } from '#shared/friendConfig';
import { AppRoutes } from '@/router/routeConfig';

const { mobile } = useDisplay();
const store = useAuthStore();
const userEmail = computed(() => store.session?.user?.email || '');

const accountData = ref<AccountDataResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const showDeleteModal = ref(false);
const isDeleting = ref(false);

const snackbar = ref({
  isVisible: false,
  message: '',
  color: 'error'
});

const showSnackbar = (message: string, color: 'success' | 'error' = 'error') => {
  snackbar.value = {
    isVisible: true,
    message,
    color
  };
};

const getLabel = (options: readonly { label: string, value: string }[], value: string) => {
  return options.find(o => o.value === value)?.label || value;
};

const deleteAccount = async () => {
  isDeleting.value = true;
  try {
    await deleteAccountRequest();
    await store.signOut();

    showDeleteModal.value = false;

    // FriendDev: Refresh to home page.
    location.assign(AppRoutes.Home.path);
  } catch (err: any) {
    showSnackbar(err.message || 'Failed to delete account. Please try again later.', 'error');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  if (!userEmail.value) {
    isLoading.value = false;

    error.value = 'We could not find an email associated with your session. Please try logging out and back in.';

    return;
  }

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
