<template>
  <div style="background-color: #FFE8DE; min-height: 100vh;" class="d-flex flex-column align-center pt-10">
    <h1 class="mb-6">
      Sign-up Form
    </h1>
    
    <VContainer style="max-width: 40rem;" class="px-6">
      <VForm @submit.prevent="submitForm" validate-on="submit lazy">
        
        <FriendTextField
          v-model="form.firstName"
          class="mb-4"
          label="Preferred Name"
          description="<b>First</b> name or nickname only!"
          placeholder="Your name"
          :rules="[FriendRules.required]"
        />

        <FriendTextField
          v-model="form.email"
          class="mb-4"
          label="University Email"
          placeholder="netid@illinois.edu"
          :rules="[FriendRules.required, FriendRules.email]"
        />

        <FriendTextField
          v-model="form.age"
          class="mb-4"
          label="Age"
          type="number"
          placeholder="Your age in years"
          :rules="[FriendRules.required]"
        />

        <FriendRadioGroup
          v-model="form.gender"
          class="mb-4"
          label="Gender Identity"
          :rules="[FriendRules.required]"
        >
          <VRadio label="Male" value="male" />
          <VRadio label="Female" value="female" />
          <VRadio label="Non-binary" value="nonbinary" />
        </FriendRadioGroup>

        <FriendRadioGroup
          v-model="form.affiliation"
          class="mb-4"
          label="University Affiliation"
          :rules="[FriendRules.required]"
        >
          <VRadio label="Underclassman (Freshman or Sophomore)" value="Underclassman" />
          <VRadio label="Upperclassman (Junior or Senior)" value="Upperclassman" />
          <VRadio label="Graduate or Professional (Ph.D, Staff, etc)" value="GradsAndPros" />
        </FriendRadioGroup>

        <FriendTextarea
          v-model="form.interests"
          class="mb-4"
          label="List 3 to 5 of your top interests, hobbies, or passions."
          description="Include anything you'd enjoy connecting over. A new hobby, a long-time passion, or just a topic you like talking about."
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          v-model="form.activities"
          class="mb-4"
          label="Friend groups often do different things. Describe 2 or 3 diverse ways you'd like to spend time with this group."
          description="Give us some range, like 'Grinding at the library, going to the ARC, or making cool projects together.'"
          :rules="[FriendRules.required]"
        />

        <FriendTextarea
          v-model="form.lore"
          class="mb-4"
          label="Lore"
          description="What are some cool projects you've worked on, or topics you know a lot about?"
          placeholder="Optional: Tell us your story..."
        />

        <FriendCheckbox
          v-model="form.pledge"
          class="mb-6"
          label="Community Pledge"
          checkbox-label="I'm at least 18 years old, and agree to be respectful to my group."
          :rules="[FriendRules.required]"
        />

        <div class="d-flex justify-start pt-3 pb-10">
          <VBtn
            size="large"
            color="primary"
            rounded
            variant="flat"
            type="submit"
            :loading="loading"
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

const loading = ref(false);

const form = reactive({
  firstName: '',
  email: '',
  age: null,
  gender: null,
  affiliation: null,
  interests: '',
  activities: '',
  lore: '',
  pledge: false
});

const submitForm = async (e: SubmitEvent) => {
  
};
</script>