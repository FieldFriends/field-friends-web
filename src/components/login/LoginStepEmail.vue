<template>
  <div class="text-center mb-8 pt-1">
    <h1 class="text-h4 font-weight-bold text-primary">
      Verify Your Email
    </h1>
    <p class="text-subtitle-1 text-secondary text-medium-emphasis mt-2">
      Enter your @illinois.edu email to continue.
    </p>
  </div>

  <v-form @submit.prevent="handleSubmit">
    <friend-text-field
      v-model="userEmail" 
      placeholder="netid@illinois.edu"
      class="mb-4 mx-8 pt-6"
      :rules="[validateEmail]"
      :disabled="loading"
      :show-card="false"
      autofocus
    />

    <turnstile-widget
      ref="turnstileRef"
      :site-key="siteKey"
      @token="handleTurnstileToken"
      @expired="handleTurnstileExpired"
      @error="handleTurnstileError"
    />

    <div class="d-flex justify-end mx-4 mx-sm-8 mt-4">
      <v-btn
        size="large"
        type="submit"
        :loading="loading"
        :disabled="!isSubmitEnabled"
      >
        Send Code
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import FriendTextField from '@/components/FriendTextField.vue';
import TurnstileWidget from '@/components/TurnstileWidget.vue';
import { EMAIL_REGEX } from '@shared/friendConfig';
import { login } from '@/services/endpoints/login';


const userEmail = defineModel<string>({ required: true });

const emit = defineEmits<{
  next: []
  error: [message: string]
}>();

const loading = ref(false);
const turnstileToken = ref('');
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null);

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const handleTurnstileToken = (token: string) => {
  turnstileToken.value = token;
};

const handleTurnstileExpired = () => {
  turnstileToken.value = '';
};

const handleTurnstileError = (err: any) => {
  turnstileToken.value = '';
  emit('error', 'Turnstile verification failed. Please try again.');
};

const resetTurnstile = () => {
  turnstileToken.value = '';
  turnstileRef.value?.reset();
}

/**
 * Validates email is @illinois.edu.
 * @param email - Email.
 */
const validateEmail = (email: string): string | boolean => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return 'Email is required';
  }
  
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return 'Must be a valid @illinois.edu address';
  }
  
  return true;
};

const isEmailValid = (email: string): boolean => {
  return validateEmail(email) === true;
}

const isSubmitEnabled = computed(() => {
  return isEmailValid(userEmail.value) && !!turnstileToken.value;
});

const handleSubmit = async () => {
  const cleanEmail = userEmail.value.trim();

  if ( !isSubmitEnabled.value ) {
    return;
  }

  try {
    loading.value = true;
    
    await login(cleanEmail, turnstileToken.value);

    // FriendDev: Login succeeded, proceed.
    emit('next');
    
  } catch (err: any) {    
    emit('error',  err.message || 'Failed to send login code.');
    
    resetTurnstile();
  } finally {
    loading.value = false;
  }
};
</script>