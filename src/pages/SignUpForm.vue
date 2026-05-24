<template>
  <div class="d-flex flex-column align-center py-10 min-h-screen">
    <h1 class="text-h3 font-weight-bold text-primary text-center">
      Sign up for Field Friends
    </h1>
  </div>

  <div class="d-flex mt-2 flex-column align-center bg-background">
    <v-container style="max-width: 40rem;" class="px-6">
      <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur">
        
        <friend-text-field
          v-model="form.name"
          class="mb-4"
          label="First Name"
          placeholder="Your name"
          shared
          :rules="rule('name')"
        >
          <template #description>
            Or nickname
          </template>
        </friend-text-field>

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
        >
          <template #description>
            Must be between ages 18&ndash;29 to participate
          </template>
        </friend-select>

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
          :shared="false"
          :rules="rule('interests')"
          :max-rows="10"
        >
          <template #description>
            <p>
              Tell us why you enjoy it
            </p> 
            <friend-example>
              I enjoy bouldering because it's kind of like solving a puzzle while getting a workout.
            </friend-example>
          </template>
        </friend-textarea>

        <friend-textarea
          v-model="form.activities"
          class="mb-4"
          label="If you met up with this group, what would you do together?"
          :shared="false"
          :rules="rule('activities')"
          :max-rows="10"
        >
          <template #description>
            <p>
              Feel free to enter a range of activities
            </p>
            <friend-example>
              Watching movies at home, going to the bars, and playing basketball.
            </friend-example>
          </template>
        </friend-textarea>
        
        <friend-textarea
          v-model="form.introduction"
          class="mb-4"
          label="How do you want to be introduced to your group?"
          shared
          :rules="rule('introduction')"
          :max-rows="10"
          :required="false"
        >
          <template #description>
            <i>Please wait until after you're matched to share contact info!</i>
          </template>
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
          :max-items="MAX_BLOCKED_EMAILS"
          :required="false"
          :user-email="userEmail"
        >
          <template #description>
            You won't be placed in a group with anyone using these email addresses.
          </template>
        </friend-email-list>

        <friend-form-card
          v-if="form.name || form.introduction"
          label="Group Email Preview"
          required
        >
          <template #description>
            A preview of what will be shared with your group when you're matched.
          </template>
          <email-matched-preview
            :name="form.name"
            :introduction="form.introduction"
            :email="userEmail"
          />
          <p v-if="!form.introduction" class="text-body-2 font-italic text-secondary">
            Without an introduction, only your name and email will be shared.            
          </p>
        </friend-form-card>

        <friend-form-card
          label="Terms & Safety Summary"
          required
          :input-id="termsCheckboxId"
        >
          <template #description>
            A quick summary of our most important safety points.
          </template>
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
                <li class="mb-2">
                  <strong>
                    Matching:
                  </strong>
                  I understand that, when matched, my email address will be shared with the group I'm matched into.
                </li>
              </ul>
            </div>
            
            <v-divider class="my-4" />

            <p class="mb-4 text-secondary font-weight-bold text-body-2">
              By checking the box below, you acknowledge that you have read and agree to our full 
              <router-link to="/legal#tos-heading" class="text-primary text-decoration-none d-inline-flex align-center" target="_blank">
                Terms of Service<v-icon icon="mdi-open-in-new" size="x-small" class="ms-1" />
              </router-link> 
              and 
              <router-link to="/legal#privacy-heading" class="text-primary text-decoration-none d-inline-flex align-center" target="_blank">
                Privacy Policy<v-icon icon="mdi-open-in-new" size="x-small" class="ms-1" />
              </router-link>. 
              Remember to always meet in public spaces!
            </p>

            <v-checkbox
              :id="termsCheckboxId"
              v-model="agreeTerms"
              color="primary"
              hide-details="auto"
              :rules="[(v: any) => !!v || 'You must agree to the terms to proceed']"
              :aria-describedby="`${descriptionId} ${termsListId}`"
            >
              <template v-slot:label>
                <div>
                  I agree to the full
                  <router-link
                    to="/legal#tos-heading"
                    class="ms-1 text-primary text-decoration-none font-weight-bold align-center"
                    target="_blank"
                    @click.stop
                  >
                    Terms of Service
                    <v-icon
                      icon="mdi-open-in-new"
                      size="x-small"
                      class="ms-1"
                    />
                  </router-link>
                  and
                  <router-link
                    to="/legal#privacy-heading"
                    class="ms-1 text-primary text-decoration-none font-weight-bold"
                    target="_blank"
                    @click.stop
                  >
                    Privacy Policy
                    <v-icon
                      icon="mdi-open-in-new"
                      size="x-small"
                      class="ms-1" 
                    />
                  </router-link>.
                </div>
              </template>
            </v-checkbox>
          </template>
        </friend-form-card>

        <div class="mt-2 mb-6 d-flex align-center text-caption text-secondary font-italic">
          <span class="opacity-80">Tip: You can use the <v-icon icon="mdi-content-save" size="small" class="mx-1 pb-1" /> button at the bottom-right to save your responses for next time.</span>
        </div>

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
import FriendExample from '@/components/FriendExample.vue';
import EmailMatchedPreview from '@/components/EmailMatchedPreview.vue';

import FriendFormCard from '@/components/FriendFormCard.vue';
import { 
  AFFILIATION_OPTIONS, 
  GENDER_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  AGE_LIMITS, 
  MAX_BLOCKED_EMAILS
} from '@shared/friendConfig';
import { useSurveyStore } from '@/stores/survey';
import { ProfileSchema, createProfileSchema } from '@shared/schemas/profileSchema';
import { useZodRules } from '@/composables/useZodRules';
import FriendEmailList from '@/components/FriendEmailList.vue';
import { useFormIO } from '@/composables/useFormIO';
import { type FriendFormState, INITIAL_FORM_STATE } from '@/types/friendFormState';
import { useFormDirty } from '@/composables/useFormDirty';
import { AppRoutes } from '@/router/routeConfig';
import { useAuthStore } from '@/stores/auth';

const { exportToJSON, importFromJSON } = useFormIO();

const fileInput = ref<HTMLInputElement | null>(null);

const snackbar = ref({
  isVisible: false,
  message: '',
  color: 'success'
});

const surveyStore = useSurveyStore();
const authStore = useAuthStore();
const formRef = ref<any>(null);
  
const agreeTerms = ref(false);

const termsCheckboxId = useId();
const termsListId = useId();

const userEmail = computed(() => authStore.session?.user?.email || null);

const { rule } = useZodRules(ProfileSchema);

const ageOptions = computed(() => {
  const range = [];
  for (let i = AGE_LIMITS.min; i <= AGE_LIMITS.max; i++) {
    range.push(i);
  }
  return range;
});

const form = reactive<FriendFormState>({ ...INITIAL_FORM_STATE });

const { suppressNextGuard, useLeaveGuard } = useFormDirty(form);
useLeaveGuard();

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
    showSnackbar('Please address the errors above before submitting.', 'error');

    return;
  }

  if (isSubmitting.value) {
    return;
  }

  // FriendDev: Try to parse the form.
  const result = createProfileSchema(userEmail.value).safeParse(form);

  if (!result.success) {
    showSnackbar('Failed to parse form responses.', 'error');

    return;
  }

  try {
    isSubmitting.value = true;

    // FriendDev: Safely use the parse result to submit the form.
    const submittedForm = await surveyStore.submitSurvey(result.data);

    if (submittedForm) {
      suppressNextGuard();
      await router.push(AppRoutes.Submitted.path);
    }
    
  } catch (err) {
    showSnackbar(surveyStore.error || 'An unexpected error occurred.', 'error');
    console.error(err);
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
const handleExport = () => {
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