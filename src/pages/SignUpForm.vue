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
          :rules="rule('name')"
        />

        <FriendSelect
          v-model="form.age"
          class="mb-4"
          label="Age"
          :items="ageOptions"
          placeholder="Select your age"
          variant="underlined"
          bg-color="white"
          :shared="false"
          :rules="rule('age')"
        />

        <FriendRadioGroup
          v-model="form.gender"
          class="mb-4"
          label="Gender Identity"
          :shared="false"
          :rules="rule('gender')"
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
          :rules="rule('affiliation')"
        >
          <VRadio 
            v-for="opt in AFFILIATION_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
          />
        </FriendRadioGroup>

        <FriendRadioGroup
          v-model="form.social_energy"
          class="mb-4"
          label="How do you recharge over the weekend?"
          :shared="false"
          :rules="rule('social_energy')"
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
          :rules="rule('interests')"
          :max-rows="10"
        />

        <FriendTextarea
          v-model="form.activities"
          class="mb-4"
          label="If you met up with this group, what would you do together?"
          description="Feel free to enter a range of activites (e.g., <i>Watching movies at home, going to the bars, and playing basketball</i>)."
          :shared="false"
          :rules="rule('activities')"
          :max-rows="10"
        />
        
        <FriendTextarea
          v-model="form.introduction"
          class="mb-4"
          label="How do you want to be introduced to your group?"
          description="This will be shared with your group."
          shared
          :rules="rule('introduction')"
          :max-rows="10"
        >
          <VBtn
            color="secondary"
          >
            Copy from previous fields
          </VBtn>
        </FriendTextarea>
        

        <!-- TODO! Rework into a modal or something better. Not now, eventually. It's not going in the DB so idc yet. -->
        <FriendCheckbox
          v-model="pledge"
          class="mb-6"
          label="Just to confirm&hellip;"
          checkbox-label="I am 18+ years old. I acknowledge that Field Friends is an independent project and doesn't fully vet users."
          description="Be smart and meet in public places!"
          :rules="[(v: any) => !!v || 'You must agree to submit your response']"
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

<!-- TODO!!!!!!!!!!!!!!!!!!!!!!! FIX .MD FILE -->

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import FriendTextField from '@/components/FriendTextField.vue';
import FriendTextarea from '@/components/FriendTextarea.vue';
import FriendRadioGroup from '@/components/FriendRadioGroup.vue';
import FriendSelect from '@/components/FriendSelect.vue';
import FriendCheckbox from '@/components/FriendCheckbox.vue';
import { 
  AFFILIATION_OPTIONS, 
  GENDER_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  AGE_LIMITS 
} from '@/config/FriendConfig';
import { useAppStore } from '@/stores/app';
import { ProfileSchema, type ProfileSubmission } from '@/types/schema';
import { useZodRules } from '@/composables/useZodRules';

const store = useAppStore();
const formRef = ref<any>(null);
const pledge = ref(false);

const { rule } = useZodRules(ProfileSchema);

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
  social_energy: undefined,
  interests: '',
  activities: '',
  introduction: '',
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    return;
  }

  if (!pledge.value) {
    return;
  }

  const success = await store.submitSurvey(form as ProfileSubmission);
  
  if (success) {
    // TODO
    alert("implement");
  }
};
</script>