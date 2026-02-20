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
      class="mb-12 mx-8 pt-6"
      :rules="[validateEmail]"
      :disabled="loading"
      :show-card="false"
      autofocus
    />

    <div class="d-flex justify-end mx-4 mx-sm-8">
      <v-btn
        size="large"
        type="submit"
        :loading="loading"
        :disabled="!isEmailValid(userEmail)"
      >
        Send Code
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FriendTextField from '@/components/FriendTextField.vue';
import { EMAIL_REGEX } from '#shared/friendConfig';
import { login } from '@/services/endpoints/login';

// TODO @FriendDev CRITICAL, if valid session, maybe just send to form?

const userEmail = defineModel<string>({ required: true });

const emit = defineEmits<{
  next: []
  error: [message: string]
}>();

const loading = ref(false);

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

const handleSubmit = async () => {
  const cleanEmail = userEmail.value.trim();

  if ( !isEmailValid(cleanEmail) ) {
    return;
  }

  try {
    loading.value = true;
    
    await login(cleanEmail);

    // FriendDev: Login succeeded, proceed.
    emit('next');
    
  } catch (err: any) {
    console.error('Login error:', err);
    
    emit('error',  err.message || 'Failed to send login code.');
  } finally {
    loading.value = false;
  }
};
</script>