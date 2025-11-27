<template>
  <div style="background-color: #FFE8DE;">
    <h1>
      Sign-up Form
    </h1>
    <VContainer width="50rem">
      <VForm>
        <FriendFormCard class="px-6 py-4 mb-4">
          <FriendTextField
            autocomplete="off"
            class="pb-1"
            description="<b>First</b> name or nickname only!"
            label="Preferred Name"
            variant="underlined"
            placeholder="Your name"
            :rules="[FriendRules.required]"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <FriendTextField
            autocomplete="off"
            class="pb-1"
            label="University Email"
            variant="underlined"
            placeholder="Your email"
            :rules="[FriendRules.required, FriendRules.email]"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <FriendTextField
            autocomplete="off"
            class="pb-1"
            label="Age"
            variant="underlined"
            type="number"
            placeholder="Your age in years"
            :rules="[FriendRules.required]"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <VRadioGroup label="Gender Identity" required>
            <VRadio label="Male" value="male" />
            <VRadio label="Female" value="female" />
            <VRadio label="Non-binary" value="nonbinary" />
          </VRadioGroup>
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <VRadioGroup label="University Affiliation" required>
            <VRadio label="Underclassman (Freshman or Sophomore)" value="Underclassman" />
            <VRadio label="Upperclassman (Junior or Senior)" value="Upperclassman" />
            <VRadio label="Graduate or Professional (Ph.D, Staff, etc)" value="GradsAndPros" />
          </VRadioGroup>
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <h4>
            List 3 to 5 of your top interests, hobbies, or passions.
          </h4>
          <p>
            Include anything you'd enjoy connecting over. A new hobby, a long-time passion, or just a topic you like talking about.
          </p>
          <VTextarea
            autocomplete="off"
            class="pb-1"
            type="number"
            :rules="[FriendRules.required]"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <h4>
            Friend groups often do different things. Describe 2 or 3 diverse ways you'd like to spend time with this group.
          </h4>
          <p>
            Give us some range, like "Grinding at the library, going to the ARC, or making cool projects together."
          </p>
          <VTextarea
            autocomplete="off"
            class="pb-1"
            type="number"
            :rules="[FriendRules.required]"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <h4>
            Lore - what are some cool projects you've worked on, or topics you know a lot about?
          </h4>
          <VTextarea
            autocomplete="off"
            class="pb-1"
            type="number"
          />
        </FriendFormCard>
        <FriendFormCard class="px-6 py-4 mb-4">
          <p>
            <b>Community pledge</b>: Something something be a good person, whatever.
          </p>
          <VCheckbox label="I agree to abide by the community pledge" />
        </FriendFormCard>
      </VForm>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { FriendRules } from '@/types/FriendRules';
</script>