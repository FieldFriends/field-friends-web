<template>
  <div class="text-center mb-8 pt-1">
    <h1 class="text-h4 font-weight-bold text-primary">
      Check Your Inbox
    </h1>
    <p class="text-subtitle-1 text-secondary text-medium-emphasis mt-2">
      Enter the code sent to <strong>{{ email }}</strong>
    </p>
  </div>

  <v-form @submit.prevent="handleVerify">
    <friend-text-field
      v-model="code"
      placeholder="Your verification code"
      label="Verification"
      class="mb-12 mx-8 pt-6"
      :rules="[(v: any) => !!v || 'Code is required']"
      :disabled="loading"
      :show-card="false"
      autofocus
    />

    <div class="d-flex flex-column gap-2 mx-4 mx-sm-8">
      <div class="d-flex flex-column-reverse flex-sm-row justify-space-between align-center mb-4 ga-3">
        <v-btn
          variant="text"
          size="large"
          color="secondary"
          :disabled="loading"
          @click="$emit('back')"
        >
          Go back
        </v-btn>

        <v-btn
          size="large"
          type="submit"
          :loading="loading"
        >
          Verify
        </v-btn>
      </div>
    </div>
    
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FriendTextField from '@/components/FriendTextField.vue';
import { supabase } from '@/services/supabase';

const props = defineProps<{
  email: string
}>();

const code = defineModel<string>({ required: true });

const emit = defineEmits<{
  back: []
  verified: []
  error: [message: string]
}>();

const loading = ref(false);

const handleVerify = async () => {
  // @FriendDev: CRITICAL REMOVE:
  emit('verified');
  return;

  const cleanCode = code.value?.trim();

  if (!cleanCode) {
    return;
  }

  try {
    loading.value = true;

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: props.email,
      token: cleanCode,
      type: 'email',
    });

    if (verifyError) {
      throw verifyError;
    }

    // FriendDev: Auth complete.
    emit('verified');

  } catch (err: any) {
    console.error('Verification error:', err);

    emit('error', 'Invalid code. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>