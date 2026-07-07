<template>
  <friend-form-card
    :label="props.label"
    :required="true"
    :shared="false"
  >
    <template #description>
      <slot name="description" />
    </template>
    
    <div class="d-flex flex-column w-100 mt-2">
      <!-- FriendDev: Use hidden input to attach validation rules to entire group. -->
      <v-input :rules="props.rules" :model-value="modelValue" hide-details="auto">
        <div class="d-flex flex-column flex-sm-row ga-4 w-100">
          <v-select
            v-model="minAffiliation"
            :items="minOptions"
            :disabled="isDisabled"
            label="Min Class Year"
            variant="underlined"
            color="primary"
            hide-details="auto"
            class="flex-1-1-100"
          />
          
          <v-select
            v-model="maxAffiliation"
            :items="maxOptions"
            :disabled="isDisabled"
            label="Max Class Year"
            variant="underlined"
            color="primary"
            hide-details="auto"
            class="flex-1-1-100"
          />
        </div>
      </v-input>
    </div>
  </friend-form-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FriendFormCard from './FriendFormCard.vue';
import { UNDERGRADUATE_AFFILIATIONS, AFFILIATION_OPTIONS } from '@shared/friendConfig';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';

const modelValue = defineModel<string[]>({ required: true, default: () => [] });

type AffiliationSelectOption = {
  title: string;
  value: string;
  props: {
    disabled: boolean;
  };
};

type Props = {
  label: string;
  targetAffiliation: ProfileSubmission['affiliation'] | null;
  rules?: any[];
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => []
});

const getIndex = (val: string) => (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(val);

const minAffiliation = computed({
  get: () => {
    if (!modelValue.value || modelValue.value.length === 0) {
      return null;
    }

    const indices = [];

    for (const val of modelValue.value) {
      const i = getIndex(val);

      if (i !== -1) {
        indices.push(i);
      }
    }

    indices.sort((a, b) => a - b);

    const firstIndex = indices[0];

    if (firstIndex === undefined) {
      return null;
    }

    return UNDERGRADUATE_AFFILIATIONS[firstIndex];
  },
  set: (newMin) => {
    if (!newMin || !maxAffiliation.value) {
      return;
    }

    updateRange(newMin, maxAffiliation.value);
  }
});

const maxAffiliation = computed({
  get: () => {
    if (!modelValue.value || modelValue.value.length === 0) {
      return null;
    }

    const indices = [];
    for (const val of modelValue.value) {

      const i = getIndex(val);

      if (i !== -1) {
        indices.push(i);
      }
    }

    indices.sort((a, b) => a - b);

    const lastIndex = indices[indices.length - 1];

    if (lastIndex === undefined) {
      return null;
    }

    return UNDERGRADUATE_AFFILIATIONS[lastIndex];
  },
  set: (newMax) => {
    if (!newMax || !minAffiliation.value) {
      return;
    }

    updateRange(minAffiliation.value, newMax);
  }
});

const updateRange = (minVal: string, maxVal: string) => {
  const minIdx = getIndex(minVal);
  const maxIdx = getIndex(maxVal);

  if (minIdx !== -1 && maxIdx !== -1) {
    const start = Math.min(minIdx, maxIdx);
    const end = Math.max(minIdx, maxIdx);
    modelValue.value = UNDERGRADUATE_AFFILIATIONS.slice(start, end + 1) as string[];
  }
};

/**
 * The options available for the minimum affiliation dropdown.
 * Computes an array of items for the select component, assigning the appropriate human-readable
 * label for each class year. Disables options that correspond to class years greater than the
 * user's own class year, since they gotta match with their own year.
 * @returns An array of objects containing title, value, and disabled properties.
 */
const minOptions = computed(() => {
  // FriendDev: The minimum class year cannot exceed the user's own class year.
  let targetIndex = UNDERGRADUATE_AFFILIATIONS.length - 1;

  if (props.targetAffiliation) {
    const foundIndex = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(props.targetAffiliation);

    if (foundIndex !== -1) {
      targetIndex = foundIndex;
    }
  }
  
  const options: AffiliationSelectOption[] = [];

  for (const [i, value] of UNDERGRADUATE_AFFILIATIONS.entries()) {
    const option = AFFILIATION_OPTIONS.find((opt) => opt.value === value);

    options.push({
      title: option ? option.label : value,
      value: value,
      props: {
        disabled: i > targetIndex
      }
    });
  }
  
  return options;
});

/**
 * The options available for the maximum affiliation dropdown.
 * Computes an array of items for the select component, assigning the appropriate human-readable
 * label for each class year. Disables options that correspond to class years lesser than the
 * user's own class year, as they must be comfortable matching with their own year.
 * @returns An array of objects containing title, value, and disabled properties.
 */
const maxOptions = computed(() => {
  // FriendDev: The maximum class year cannot be less than the user's own class year.
  let targetIndex = 0;

  if (props.targetAffiliation) {
    const foundIndex = (UNDERGRADUATE_AFFILIATIONS as readonly string[]).indexOf(props.targetAffiliation);

    if (foundIndex !== -1) {
      targetIndex = foundIndex;
    }
  }
  
  const options: AffiliationSelectOption[] = [];

  for (const [i, value] of UNDERGRADUATE_AFFILIATIONS.entries()) {
    const option = AFFILIATION_OPTIONS.find((opt) => opt.value === value);

    options.push({
      title: option ? option.label : value,
      value: value,
      props: {
        disabled: i < targetIndex
      }
    });
  }
  
  return options;
});

/**
 * Determines if the dropdowns should be disabled.
 * Dropdowns are only disabled if the user's target affiliation is null.
 * @returns True if the fields should be disabled, false otherwise.
 */
const isDisabled = computed(() => {
  if (props.targetAffiliation === null) {
    return true;
  }
  
  return false;
});

</script>
