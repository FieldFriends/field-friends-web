<template>
  <div style="background-color: #ffbeacff; min-height: 100vh;" class="d-flex flex-column align-center pt-10">
    <h1 class="mb-6">
      Sign-up Form
    </h1>
    
    <VContainer style="max-width: 40rem;" class="px-6">
      <VForm @submit.prevent="submitForm" validate-on="blur">
        
        <FriendTextField
          v-model="form.name"
          class="mb-4"
          label="Preferred Name"
          description="<b>First</b> name or nickname only!"
          placeholder="Your name"
          shared
          :rules="[FriendRules.required]"
        />

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
          v-model="form.interests"
          class="mb-4"
          label="List 3 to 5 of your top interests, hobbies, or passions."
          description="Include anything you'd enjoy connecting over. A new hobby, a long-time passion, or just a topic you like talking about."
          :shared="false"
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          v-model="form.hangout_style"
          class="mb-4"
          label="Friend groups often do different things. Describe 2 or 3 diverse ways you'd like to spend time with this group."
          description="Give us some range, like &quot;<i>Grinding at the library, going to the ARC, or making cool projects together.</i>&quot;"
          :shared="false"
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          v-model="form.lore"
          class="mb-4"
          label="Lore"
          description="What are some cool projects you've worked on, or topics you know a lot about?"
          :shared="false"
        />
        
        <FriendTextarea
          v-model="form.introduction"
          class="mb-4"
          label="What would you like your group to know about you?"
          shared
        />

        <FriendCheckbox
          v-model="pledge"
          class="mb-6"
          label="Community Pledge"
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