<template>
  <div style="background-color: #ffbeacff; min-height: 100vh;" class="d-flex flex-column align-center pt-10">
    <h1 class="mb-6">
      Sign-up Form
    </h1>
    
    <VContainer style="max-width: 40rem;" class="px-6">
      <VForm ref="formRef" @submit.prevent="submitForm" validate-on="blur">
        
        <FriendTextField
          v-model="form.name"
          class="mb-4"
          label="Preferred Name"
          description="<b>First</b> name or nickname only!"
          placeholder="Your name"
          shared
          :rules="[FriendRules.required]"
        />

        <FriendSelect
          v-model="form.age"
          class="mb-4"
          label="Age"
          :items="ageOptions"
          placeholder="Select your age"
          variant="underlined"
          bg-color="white"
          :rules="[FriendRules.required]"
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

        <FriendRadioGroup
          v-model="form.group_role"
          class="mb-4"
          label="In a group of friends, which role do you usually fall into?"
          :shared="false"
          :rules="[FriendRules.required]"
        >
          <VRadio 
            v-for="opt in GROUP_ROLE_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
            class="mb-2"
          />
        </FriendRadioGroup>

        <FriendRadioGroup
          v-model="form.social_energy"
          class="mb-4"
          label="How do you recharge over the weekend?"
          :shared="false"
          :rules="[FriendRules.required]"
        >
          <VRadio 
            v-for="opt in SOCIAL_ENERGY_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
            class="mb-2"
          />
        </FriendRadioGroup>

        <FriendTextarea
          v-model="form.interests"
          class="mb-4"
          label="What is a hobby, topic, or activity you are currently really into?"
          description="Tell us <b>why</b> you enjoy it (e.g., <i>I enjoy bouldering because it feels like solving a puzzle while exercising</i>)."
          :shared="false"
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          v-model="form.lore"
          class="mb-4"
          label="If you had to give a 10-minute TED Talk with no preparation, what would it be about?"
          description="This can be about literally anything (a video game, a history fact, knitting, basketball, etc.)."
          :shared="false"
          :rules="[FriendRules.required]"
        />
        
        <FriendTextarea
          v-model="form.introduction"
          class="mb-4"
          label="How do you want to be introduced to your group?"
          description="This will be shared with your group."
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
          checkbox-label="I certify I am 18+ years old. I acknowledge that Field Friends is an independent project and does not conduct background checks. I agree to meet my group only in public places and assume all risks."
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
import { ref, reactive, computed } from 'vue';
import { FriendRules } from '@/types/FriendRules';
import FriendTextField from '@/components/FriendTextField.vue';
import FriendTextarea from '@/components/FriendTextarea.vue';
import FriendRadioGroup from '@/components/FriendRadioGroup.vue';
import FriendSelect from '@/components/FriendSelect.vue';
import FriendCheckbox from '@/components/FriendCheckbox.vue';
import { 
  AFFILIATION_OPTIONS, 
  GENDER_OPTIONS,
  GROUP_ROLE_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  AGE_LIMITS 
} from '@/config/FriendConfig';
import { useAppStore } from '@/stores/app';
import type { ProfileSubmission } from '@/types/schema';

const store = useAppStore();
const formRef = ref<any>(null);
const pledge = ref(false);

const ageOptions = computed(() => {
  const range = [];
  for (let i = AGE_LIMITS.min; i <= AGE_LIMITS.max; i++) {
    range.push(i);
  }
  return range;
});

const form = reactive<Partial<ProfileSubmission>>({
  name: '',
  age: undefined,
  gender: undefined,
  affiliation: undefined,
  group_role: undefined,
  social_battery: undefined,
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