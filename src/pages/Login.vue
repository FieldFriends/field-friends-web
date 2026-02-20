<template>
  <v-container class="fill-height justify-center bg-background">
    
    <v-snackbar
      v-model="showError"
      color="error"
      location="top"
      timeout="7000"
      variant="tonal"
    >
      {{ errorMessage }}
      
      <template #actions>
        <v-btn icon="mdi-close" variant="text" @click="showError = false" />
      </template>
    </v-snackbar>

    <v-card elevation="4" width="100%" max-width="450" class="pt-12 pb-8 px-4 rounded-lg">
      
      <v-window v-model="step">
        
        <v-window-item :value="VerificationStep.Email">
          <login-step-email
            v-model="email"
            @next="handleNextStep"
            @error="handleError"
          />
        </v-window-item>

        <v-window-item :value="VerificationStep.Otp">
          <login-step-otp
            v-model="otpCode"
            :email="email"
            @back="handlePreviousStep"
            @verified="handleVerified"
            @error="handleError"
          />
        </v-window-item>

      </v-window>

    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginStepEmail from '@/components/login/LoginStepEmail.vue';
import LoginStepOtp from '@/components/login/LoginStepOtp.vue';
import { AppRoutes } from '@/router/routeConfig';

const router = useRouter();

enum VerificationStep {
  Email = 'email',
  Otp = 'otp'
};

const step = ref<VerificationStep>(VerificationStep.Email);
const email = ref('');
const otpCode = ref('');

const showError = ref(false);
const errorMessage = ref('');

const handleError = (msg: string) => {
  errorMessage.value = msg;
  showError.value = true;
};

const handleVerified = async () => {
  await router.push(AppRoutes.Form.path);
};

const handleNextStep = () => {
  if (step.value === VerificationStep.Otp) {
    return;
  }

  step.value = VerificationStep.Otp;
};

const handlePreviousStep = () => {
  if (step.value === VerificationStep.Email) {
    return;
  }

  step.value = VerificationStep.Email;
};
</script>