<template>
  <friend-form-card
    :label="props.label"
    :required="true"
    :shared="false"
  >
    <template #description>
      <slot name="description" />
    </template>
    
    <div class="d-flex flex-column ga-2 w-100 mt-2">
      <!-- FriendDev: Use hidden input to attach validation rules to entire group. -->
      <v-input :rules="props.rules" :model-value="modelValue" hide-details="auto">
        <div class="w-100">
          <v-checkbox
            v-for="option in allowedOptions"
            :key="option.value"
            v-model="selectedAffiliations"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
            color="primary"
            hide-details="auto"
            class="mb-2"
          />
        </div>
      </v-input>
    </div>
  </friend-form-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FriendFormCard from './FriendFormCard.vue';
import { NON_UNDERGRADUATE_AFFILIATIONS, AFFILIATION_OPTIONS, Affiliation } from '@shared/friendConfig';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';

const modelValue = defineModel<string[]>({ required: true, default: () => [] });

type Props = {
  label: string;
  targetAffiliation: ProfileSubmission['affiliation'] | null;
  rules?: any[];
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => []
});

/**
 * Computed proxy for the selected checkboxes to guarantee self-inclusion.
 */
const selectedAffiliations = computed({
  get: () => {
    return modelValue.value || [];
  },
  set: (newVal: string[]) => {
    const updated = [...newVal];
    
    // FriendDev: Force self-inclusion.
    if (props.targetAffiliation && !updated.includes(props.targetAffiliation)) {
      updated.push(props.targetAffiliation);
    }

    modelValue.value = updated;
  }
});

/**
 * Dynamically computes allowed checkboxes based on user's affiliation.
 */
const allowedOptions = computed(() => {
  if (!props.targetAffiliation) {
    return [];
  }

  const options = [];

  for (const value of NON_UNDERGRADUATE_AFFILIATIONS) {
    // FriendDev: Grads can't match with faculty.
    if (props.targetAffiliation === Affiliation.Graduate && value === Affiliation.Faculty) {
      continue;
    }

    // FriendDev: Faculty can't match with grads.
    if (props.targetAffiliation === Affiliation.Faculty && value === Affiliation.Graduate) {
      continue;
    }

    const option = AFFILIATION_OPTIONS.find((opt) => opt.value === value);
    
    options.push({
      label: option ? option.label : value,
      value: value,
      
      // FriendDev: Check and disable their own affiliation.
      disabled: value === props.targetAffiliation
    });
  }

  return options;
});
</script>
