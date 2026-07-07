<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-4 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mt-md-4">
            <section class="mb-12" aria-labelledby="submission-heading">
              <h1 id="submission-heading" class="text-h4 font-weight-bold mb-1 text-primary">
                Account
              </h1>
              
              <div class="my-2">
                <p class="text-body-1 font-weight-bold text-primary font-dm-sans">
                  {{ userEmail }}
                </p>
              </div>

              <v-divider class="border-opacity-25" color="secondary" aria-hidden="true" />
            </section>
          </div>

          <div class="text-center mt-12 mb-12" v-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="my-4" />
            
            <p class="text-body-1 text-secondary font-italic font-eb-garamond">
              Loading your account data..
            </p>
          </div>

          <div v-else-if="error" class="text-center mt-12 mb-12">
            <v-icon icon="mdi-alert-circle-outline" color="secondary" size="large" class="mb-4" />
            <p class="text-body-1 text-secondary mb-8">
              {{ error }}
            </p>
          </div>

          <template v-else>
            <div v-if="hasSubmitted" class="mb-12">
              <h2 class="text-h6 text-primary font-weight-bold text-center mt-6 text-eb-garamond">
                We have your submission.
              </h2>

              <div class="d-flex justify-center">
                <v-alert
                  class="mt-6"
                  variant="tonal"
                  color="primary"
                  icon="mdi-shield-lock-outline"
                  :max-width="600"
                >
                  Your form submission has been encrypted and de-identified.
                  Because of this, we can't display your responses.
                </v-alert>
              </div>
              <p class="text-body-2 text-secondary font-italic mt-4 text-center">
                <template v-if="configStore.loading || !configStore.isAppStateLoaded">
                  <v-skeleton-loader type="text" class="mx-auto" width="300" />
                </template>
                <template v-else>
                  Your Field Friends account will automatically be deleted on <strong>{{ getWindowEndDateString }}</strong>.
                </template>
              </p>
            </div>

            <!-- <v-divider class="border-opacity-25" color="secondary" /> -->
            <div class="text-center mt-0 pt-0">
              <template v-if="configStore.isAcceptingResponses">
                <template v-if="hasSubmitted">
                  <p class="text-body-1 text-secondary mb-4">
                    Want to change your answers?
                  </p>
                  <v-btn
                    :to="AppRoutes.Form.withResubmit()"
                    color="primary"
                    variant="flat"
                    class="px-9 text-none mb-8"
                  >
                    Resubmit
                  </v-btn>
                </template>
                <template v-else>
                  <p class="text-body-1 text-secondary mb-4">
                    It looks like you haven't filled out the form!
                  </p>
                  <v-btn
                    :to="AppRoutes.Form"
                    color="primary"
                    variant="flat"
                    class="px-9 text-none mb-8"
                  >
                    Sign up
                  </v-btn>
                </template>

                <v-divider class="mb-8 mx-16 border-opacity-25" color="secondary" />
              </template>

              <v-btn
                color="error"
                variant="outlined"
                class="px-9 text-none"
                @click="showDeleteModal = true"
              >
                Delete Account
              </v-btn>
            </div>
          </template>
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
import { useAuthStore } from '@/stores/auth';
import { useConfigStore } from '@/stores/config';
import { deleteAccountRequest } from '@/services/endpoints/deleteAccountRequest';
import { AppRoutes } from '@/router/routeConfig';
import { useSurveyStore } from '@/stores/survey';
import { hasUserSubmitted } from '@/utils/storeUtils';
import { useWindowDates } from '@/composables/useWindowDates';

const { mobile } = useDisplay();
const { getWindowEndDateString } = useWindowDates();
const store = useAuthStore();
const configStore = useConfigStore();
const surveyStore = useSurveyStore();
const userEmail = computed(() => store.session?.user?.email || '');

const isLoading = ref(true);
const error = ref<string | null>(null);

const showDeleteModal = ref(false);
const isDeleting = ref(false);

const hasSubmitted = ref(false);

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

const fetchSubmissionStatus = async () => {
  try {
    hasSubmitted.value = await hasUserSubmitted(surveyStore);
  } catch (err: any) {
    error.value = err.message || 'Failed to determine if you have submitted your profile yet.';

    // FriendDev: Show resubmit link just in case! Otherwise they wouldn't be able to change
    //            their answers if this fails.
    hasSubmitted.value = true;
  }
}

onMounted(async () => {
  if (!userEmail.value) {
    isLoading.value = false;

    error.value = 'We could not find an email associated with your session. Please try logging out and back in.';

    return;
  }

  isLoading.value = true;

  await fetchSubmissionStatus();

  isLoading.value = false;
});
</script>
