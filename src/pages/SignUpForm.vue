<template>
  <div style="background-color: #ffbeacff; min-height: 100vh;" class="d-flex flex-column align-center pt-10">
    <h1 class="mb-6">
      Sign-up Form
    </h1>
    
    <VContainer style="max-width: 40rem;" class="px-6">
      <VForm @submit.prevent="submitForm" validate-on="blur">
        
        <!-- TODO! Add char limit -->
        <FriendTextField
          v-model="form.name"
          class="mb-4"
          label="Preferred Name"
          description="<b>First</b> name or nickname only!"
          placeholder="Your name"
          shared
          :rules="[FriendRules.required]"
        />

        <!-- TODO!!!!! Change to select dropdown -->
        <FriendNumberInput
          v-model="form.age"
          class="mb-4"
          label="Age"
          type="number"
          placeholder="Your age in years"
          control-variant="stacked"
          :shared="false"
          :rules="[FriendRules.required, FriendRules.age]"
          
        />

        <FriendRadioGroup
          v-model="form.gender"
          class="mb-4"
          label="Gender Identity"
          :shared="false"
          :rules="[FriendRules.required]"
        >
          <VRadio 
            v-for="opt in GENDER_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value" 
          />
        </FriendRadioGroup>

        <!-- TODO: Consider age separation instead of affiliation -->
        <FriendRadioGroup
          v-model="form.affiliation"
          class="mb-4"
          label="University Affiliation"
          :shared="false"
          :rules="[FriendRules.required]"
        >
          <VRadio 
            v-for="opt in AFFILIATION_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
          />
        </FriendRadioGroup>

        <FriendTextarea
          class="mb-4"
          label=""
          description="Include anything you'd enjoy connecting over. A new hobby, a long-time passion, or just a topic you like talking about."
          :shared="false"
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          class="mb-4"
          label="How do you recharge over the weekend?"
          description="Include anything you'd enjoy connecting over. A new hobby, a long-time passion, or just a topic you like talking about."
          :shared="false"
          :rules="[FriendRules.required]"
        />
        
        <FriendTextarea
          v-model="form.introduction"
          class="mb-4"
          label="What would you like your group to know about you?"
          shared
        >
          <VBtn
            color="secondary"
          >
            Copy from previous fields
          </VBtn>
        </FriendTextarea>
        

        <FriendCheckbox
          v-model="pledge"
          class="mb-6"
          label="Just to confirm&hellip;"
          checkbox-label="I'm at least 18 years old, and agree to be respectful to my group."
          :rules="[FriendRules.required]"
        />

        <VAlert
          v-if="store.error"
          type="error"
          variant="tonal"
          class="mb-6"
          closable
        >
          {{ store.error }}
        </VAlert>

        <div class="d-flex justify-start pt-3 pb-10">
          <VBtn
            size="large"
            color="primary"
            rounded
            variant="flat"
            type="submit"
            text="Submit" 
          />
        </div>

      </VForm>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { FriendRules } from '@/types/FriendRules';
import FriendTextField from '@/components/FriendTextField.vue';
import FriendTextarea from '@/components/FriendTextarea.vue';
import FriendRadioGroup from '@/components/FriendRadioGroup.vue';
import FriendCheckbox from '@/components/FriendCheckbox.vue';
import { AFFILIATION_OPTIONS, GENDER_OPTIONS } from '@/config/FriendConfig';
import { useAppStore } from '@/stores/app';
import type { ProfileSubmission } from '@/types/schema';

const store = useAppStore();
const formRef = ref<any>(null);
const pledge = ref(false);

const form = reactive<Partial<ProfileSubmission>>({
  name: '',
  age: undefined,
  gender: undefined,
  affiliation: undefined,
  interests: '',
  hangout_style: '',
  lore: '',
  introduction: '',
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    return;
  }

  const success = await store.submitSurvey(form as ProfileSubmission);
  
  if (success) {
    // TODO
    alert("Success! We'll be in touch.");
  }
};
</script>