<template>
  <div class="bg-background text-primary d-flex flex-column min-vh-100">
    <v-container class="flex-grow-1 pt-4 pb-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          
          <div class="text-center mt-12 mb-12" v-if="isLoading">
            <v-progress-circular indeterminate color="primary" class="my-4" />
            
            <p class="text-body-1 text-secondary font-italic font-eb-garamond">
              Processing your request...
            </p>
          </div>

          <div v-else-if="error" class="text-center mt-12 mb-12">
            <v-icon icon="mdi-alert-circle-outline" color="secondary" size="large" class="mb-4" />
            
            <p class="text-body-1 text-secondary mb-8">
              {{ error }}
            </p>
            
            <v-btn
              color="primary"
              variant="flat"
              class="px-9 text-none"
              @click="goHome"
            >
              Return Home
            </v-btn>
          </div>

          <div v-else-if="success" class="mt-md-4 text-center">
            <h1 class="text-h4 font-weight-bold text-primary mb-4 font-dm-sans">
              Unsubscribed
            </h1>
            
            <p class="text-body-1 text-secondary page-text mb-8">
              Your account and data have been successfully deleted. You will no longer receive emails from us.
            </p>
            
            <v-btn
              color="primary"
              variant="flat"
              class="px-9 text-none mb-8"
              @click="goHome"
            >
              Return Home
            </v-btn>
          </div>

          <div v-else class="mt-md-4">
             <section class="mb-12 text-center">
                <h1 class="text-h4 font-weight-bold mb-4 text-primary font-dm-sans">
                  Unsubscribe
                </h1>
                
                <p class="text-body-1 text-secondary font-italic font-weight-bold font-dm-sans mb-6">
                  Are you sure you want to unsubscribe from Field Friends?
                </p>
                
                <p class="text-body-1 text-secondary mb-8 px-4">
                  This will permanently delete your account and all associated data, including your form responses. This also withdraws you from any ongoing matching rounds. You won't receive any more emails from us.
                </p>
                
                <v-divider class="mb-8 mx-16 border-opacity-25" color="secondary" />
                
                <div class="d-flex flex-column-reverse flex-sm-row justify-center align-center ga-4">
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    class="px-9 text-none"
                    @click="goHome"
                    :disabled="isSubmitting"
                  >
                    Cancel
                  </v-btn>
                  
                  <v-btn
                    color="error"
                    variant="flat"
                    @click="submitUnsubscribe"
                    :loading="isSubmitting"
                    class="px-9 text-none"
                  >
                    Delete Account
                  </v-btn>
                </div>
            </section>
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppRoutes } from '@/router/routeConfig';
import { UnsubscribeRequestSchema } from '@shared/schemas/unsubscribeRequestSchema';
import type { UnsubscribeRequest } from '@shared/schemas/unsubscribeRequestSchema';
import { unsubscribeRequest } from '@/services/endpoints/unsubscribeRequest';

const route = useRoute();
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const unsubscribePayload = ref<UnsubscribeRequest | null>(null);

const goHome = () => {
  location.assign(AppRoutes.Home.path);
};

const submitUnsubscribe = async () => {
  if (!unsubscribePayload.value) {
    return;
  }
  
  isSubmitting.value = true;
  error.value = null;

  try {
    await unsubscribeRequest(unsubscribePayload.value);
    
    success.value = true;
  } catch (err: any) {
    console.error('Unsubscribe failed:', err);
    error.value = err.message || 'An unexpected error occurred while trying to unsubscribe.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  try {
    const result = UnsubscribeRequestSchema.safeParse(route.query);

    if (!result.success) {
      error.value = 'Invalid unsubscribe link. The link may be malformed or expired.';
      return;
    }

    unsubscribePayload.value = result.data;

  } catch {
    error.value = 'An unexpected error occurred while verifying your link.';
  } finally {
    isLoading.value = false;
  }
});
</script>
