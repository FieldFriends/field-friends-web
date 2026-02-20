<template>
  <div class="d-flex flex-column align-center py-12 bg-surface-variant min-h-screen border-b-lg">
    <h1 class="text-h3 font-weight-bold text-primary text-center">
      Sign up for Field Friends
    </h1>
  </div>

  <div class="d-flex mt-8 flex-column align-center bg-background">
    <v-container style="max-width: 40rem;" class="px-6 font-roboto">
      <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur">
        
        <friend-text-field
          v-model="form.name"
          class="mb-4"
          label="First Name"
          description="Or nickname"
          placeholder="Your name"
          shared
          :rules="rule('name')"
        />

        <friend-select
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

        <friend-radio-group
          v-model="form.gender"
          class="mb-4"
          label="Gender Identity"
          :shared="false"
          :rules="rule('gender')"
        >
          <v-radio 
            v-for="opt in GENDER_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value" 
          />
        </friend-radio-group>

        <friend-radio-group
          v-model="form.affiliation"
          class="mb-4"
          label="University Affiliation"
          :shared="false"
          :rules="rule('affiliation')"
        >
          <v-radio 
            v-for="opt in AFFILIATION_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
          />
        </friend-radio-group>

        <friend-radio-group
          v-model="form.social_energy"
          class="mb-4"
          label="How do you recharge over the weekend?"
          :shared="false"
          :rules="rule('social_energy')"
        >
          <v-radio 
            v-for="opt in SOCIAL_ENERGY_OPTIONS" 
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.value"
            class="mb-2"
          />
        </friend-radio-group>

        <friend-textarea
          v-model="form.interests"
          class="mb-4"
          label="What are some hobbies, topics, or activities you are currently really into?"
          description="Tell us <i>why</i> you enjoy it (e.g., <i>I enjoy bouldering because it feels like solving a puzzle while exercising</i>)."
          :shared="false"
          :rules="rule('interests')"
          :max-rows="10"
        />

        <friend-textarea
          v-model="form.activities"
          class="mb-4"
          label="If you met up with this group, what would you do together?"
          description="Feel free to enter a range of activities (e.g., <i>Watching movies at home, going to the bars, and playing basketball</i>)."
          :shared="false"
          :rules="rule('activities')"
          :max-rows="10"
        />
        
        <friend-textarea
          v-model="form.introduction"
          class="mb-4"
          label="How do you want to be introduced to your group?"
          shared
          :rules="rule('introduction')"
          :max-rows="10"
          :required="false"
        >
          <div class="d-flex flex-wrap ga-2">
            <v-btn
              prepend-icon="mdi-content-duplicate"
              variant="tonal"
              color="secondary"
              size="default"
              class="text-body-2"
              rounded="lg"
              :disabled="isTextInIntro(form.interests)"
              @click="handleAppendToIntro(form.interests)"
            >
              Append Your Interests
            </v-btn>

            <v-btn
              prepend-icon="mdi-content-duplicate"
              variant="tonal"
              color="secondary"
              size="default"
              class="text-body-2"
              rounded="lg"
              :disabled="isTextInIntro(form.activities)"
              @click="handleAppendToIntro(form.activities)"
            >
              Append Group Activities
            </v-btn>
          </div>
        </friend-textarea>

        <friend-email-list
          v-model="form.blocked_emails"
          class="mb-4"
          label="Blocked Emails"
          description="You won't be placed in a group with anyone using these email addresses."
          :max-items="MAX_BLOCKED_EMAILS"
          :required="false"
        />

        <friend-form-card
          label="Terms & Safety"
          description="Please review and agree to the following terms."
          :required="true"
          :input-id="termsCheckboxId"
        >
          <template #default="{ descriptionId }">
            <div :id="termsListId" class="mb-4 text-body-1">
              <ul class="pl-6 mb-2">
                <li class="mb-2">
                  <strong>
                    Independence:
                  </strong>
                  I understand Field Friends is an independent project, not affiliated with the University.
                </li>
                <li class="mb-2">
                  <strong>
                    Screening:
                  </strong>
                  I understand that while emails are <strong>@illinois.edu</strong> verified,
                  Field Friends does not screen participants.
                </li>
              </ul>
            </div>

            <v-divider class="my-4" />

            <p class="mb-4 text-secondary text-body-2">
              We recommend meeting in public spaces to get to know your group!
            </p>

            <v-checkbox
              :id="termsCheckboxId"
              v-model="agreeTerms"
              label="I agree to the terms above"
              color="primary"
              hide-details="auto"
              :rules="[(v: any) => !!v || 'You must agree to the terms to proceed']"
              :aria-describedby="`${descriptionId} ${termsListId}`"
            />
          </template>
        </friend-form-card>

        <v-snackbar
          v-model="snackbar.isVisible"
          timeout="3000"
          location="bottom center"
          class="mb-16"
          :color="snackbar.color"
        >
          {{ snackbar.message }}
          
          
          <template v-slot:actions>
            <v-divider
              class="mx-3 my-3 opacity-50"
              color="white"
              vertical
              :thickness="1"
            />

            <v-btn
              color="white"
              variant="text"
              @click="snackbar.isVisible = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <div class="d-flex justify-start pt-3 pb-10">
          <v-btn
            type="submit"
            text="Submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>
      </v-form>

      <div class="d-flex justify-center ga-4 pt-4 pb-12">
        <!-- Hidden file input for import logic. -->
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleImport"
        />
      </div>

    </v-container>
  </div>
  <v-speed-dial
    location="bottom right"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
        v-bind="activatorProps"
        size="large"
        icon="mdi-content-save"
        color="secondary"
        elevation="4"
        location="bottom right"
        app
        appear
        rounded="pill"
      />
    </template>

    <v-btn
      key="1"
      prepend-icon="mdi-download"
      color="secondary"
      size="large"
      elevation="4"
      @click="handleExport"
    >
      Save Responses
    </v-btn>

    <v-btn
      key="2"
      prepend-icon="mdi-upload"
      color="secondary"
      size="large"
      elevation="4"
      @click="triggerImport"
    >
      Load Responses
    </v-btn>
  </v-speed-dial>
</template>



<script setup lang="ts">
import { ref, reactive, computed, useId } from 'vue';
import FriendTextField from '@/components/FriendTextField.vue';
import FriendTextarea from '@/components/FriendTextarea.vue';
import FriendRadioGroup from '@/components/FriendRadioGroup.vue';

import FriendFormCard from '@/components/FriendFormCard.vue';
import { 
  AFFILIATION_OPTIONS, 
  GENDER_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  AGE_LIMITS, 
  MAX_BLOCKED_EMAILS
} from '#shared/friendConfig';
import { useAppStore } from '@/stores/app';
import { ProfileSchema } from '#shared/schemas/profileSchema';
import { useZodRules } from '@/composables/useZodRules';
import FriendEmailList from '@/components/FriendEmailList.vue';
import { useFormIO } from '@/composables/useFormIO';
import type { FriendFormState } from '@/types/friendFormState';
import { AppRoutes } from '@/router/routeConfig';

const { exportToJSON, importFromJSON } = useFormIO();

const fileInput = ref<HTMLInputElement | null>(null);

const snackbar = ref({
  isVisible: false,
  message: '',
  color: 'success'
});

const store = useAppStore();
const formRef = ref<any>(null);
  
const agreeTerms = ref(false);

const termsCheckboxId = useId();
const termsListId = useId();

const { rule } = useZodRules(ProfileSchema);

const ageOptions = computed(() => {
  const range = [];
  for (let i = AGE_LIMITS.min; i <= AGE_LIMITS.max; i++) {
    range.push(i);
  }
  return range;
});

const form = reactive<FriendFormState>({
  name: '',
  age: null,
  gender: null,
  affiliation: null,
  social_energy: null,
  interests: '',
  activities: '',
  introduction: '',
  blocked_emails: []
});

const router = useRouter();

const isSubmitting = ref(false);

const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
  snackbar.value = {
    isVisible: true,
    message,
    color
  };
};

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid || !agreeTerms.value) {
    return;
  }

  if (isSubmitting.value) {
    return;
  }

  // FriendDev: Try to parse the form.
  const result = ProfileSchema.safeParse(form);

  if (!result.success) {
    // TODO handle better.
    console.error("Error on form submission.");

    return;
  }

  try {
    isSubmitting.value = true;

    // FriendDev: Safely use the parse result to submit the form.
    const submittedForm = await store.submitSurvey(result.data);

    if (submittedForm) {
      await router.push(AppRoutes.Submitted.path);
    }
    
  } catch (err) {
    console.error("Submission error: ", err);
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Append text on a new line to a string.
 * @param target - Text to modify.
 * @param toAppend - Text to append.
 */
const appendText = (
  target: string | null | undefined, 
  toAppend: string | null | undefined
): string => {
  // FriendDev: No target, just return append text.
  if (!target?.trim()) {
    return toAppend?.trim() || "";
  }

  // FriendDev: Nothing to append, do nothing.
  if (!toAppend?.trim()) {
    return target;
  }

  // FriendDev: Both strings exist, so combine them with a newline
  return `${target}\n${toAppend?.trim()}`;
};

/**
 * Check if text is already present in the introduction.
 * @param text - Text to check for.
 */
const isTextInIntro = (text: string | null | undefined): boolean => {
  const cleanText = text?.trim();

  // FriendDev: Disable if there is no text to append.
  if (!cleanText) {
    return true; 
  }
  
  // FriendDev: Return true if intro already includes this text.
  if (form.introduction?.includes(cleanText)) {
    return true;
  }

  return false;
}

/**
 * Append specific text to the introduction if unique.
 * @param textToAppend - Text to append.
 */
const handleAppendToIntro = (textToAppend: string | null | undefined) => {
  // FriendDev: Prevent duplicates or empty appends.
  if (isTextInIntro(textToAppend)) {
    return;
  }

  form.introduction = appendText(form.introduction, textToAppend);
}

/**
 * Save responses to a JSON file.
 */
const handleExport = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    showSnackbar('Please fix validation errors before exporting.', 'error');
    
    return;
  }

  exportToJSON(form, 'field-friends-responses.json');
};

const triggerImport = () => {
  fileInput.value?.click();
};

/**
 * Attempt to load responses from a JSON file.
 */
const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  try {
    const importedData = await importFromJSON(file, ProfileSchema);
    
    Object.assign(form, importedData);
    
    target.value = '';
    
    showSnackbar('Responses imported successfully!');
  } catch (error) {
    console.error('Import failed:', error);
    showSnackbar('Failed to import responses. File may be invalid.', 'error');
  }
};
</script>