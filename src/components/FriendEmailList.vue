<template>
  <friend-form-card
    :label="props.label"
    :description="props.description"
    :required="false"
    :shared="false"
  >
    <template #default="{ labelId, descriptionId }">
      <div 
        class="d-flex flex-column"
        role="group"
        :aria-labelledby="labelId"
        :aria-describedby="descriptionId"
      >
        <div
          v-for="(email, index) in model"
          :key="index"
          class="d-flex align-center mb-2"
        >
          <v-text-field
            v-model="model[index]"
            placeholder="netid@illinois.edu"
            variant="underlined"
            color="primary"
            hide-details="auto"
            class="flex-grow-1 mb-1"
            :rules="emailRules"
            :aria-label="`Blocked Email ${index + 1}`"
          />

          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="ml-2"
            @click="removeEmail(index)"
            aria-label="Remove email"
          />
        </div>

        <div class="mt-2 d-flex align-center">
          <v-btn
            prepend-icon="mdi-plus"
            variant="tonal"
            color="primary"
            size="default"
            class="text-body-2"
            rounded="md"
            :disabled="maxEmailsReached"
            @click="addEmail"
          >
            Add Email
          </v-btn>
        </div>

        <div v-if="maxEmailsReached" class="text-caption text-warning mt-2 font-weight-bold">
          Maximum number of blocked emails reached.
        </div>
      </div>
    </template>
  </friend-form-card>
</template>

<script setup lang="ts">
import FriendFormCard from './FriendFormCard.vue';
import { EMAIL_REGEX, MAX_BLOCKED_EMAILS } from '#shared/friendConfig';

defineOptions({ inheritAttrs: false });

const model = defineModel<string[]>({ required: true, default: [] });

type Props = {
  label: string;
  description?: string;
  maxItems?: number;
};

const props = withDefaults(defineProps<Props>(), {
  maxItems: MAX_BLOCKED_EMAILS
});

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => EMAIL_REGEX.test(v) || 'Must be a valid @illinois.edu address'
];

const addEmail = () => {
  if (model.value.length < props.maxItems) {
    model.value.push('');
  }
};

const removeEmail = (index: number) => {
  model.value.splice(index, 1);
};

const maxEmailsReached = computed(() => {
  return model.value.length >= props.maxItems;
});
</script>