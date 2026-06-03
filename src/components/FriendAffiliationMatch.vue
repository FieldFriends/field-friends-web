<template>
  <friend-form-card
    :label="props.label"
    :required="true"
    :shared="false"
  >
    <template #description>
      <slot name="description" />
    </template>
    
    <div class="d-flex flex-column flex-sm-row ga-4 w-100 mt-2">
      <v-select
        v-model="minAffiliation"
        :items="minOptions"
        :rules="props.minRules"
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
        :rules="props.maxRules"
        :disabled="isDisabled"
        label="Max Class Year"
        variant="underlined"
        color="primary"
        hide-details="auto"
        class="flex-1-1-100"
      />
    </div>
  </friend-form-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FriendFormCard from './FriendFormCard.vue';
import { UNDERGRADUATE_AFFILIATIONS, AFFILIATION_OPTIONS } from '@shared/friendConfig';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';

const minAffiliation = defineModel<ProfileSubmission['desired_affiliation_min'] | null>('minAffiliation');
const maxAffiliation = defineModel<ProfileSubmission['desired_affiliation_max'] | null>('maxAffiliation');

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
  minRules?: any[];
  maxRules?: any[];
};

const props = withDefaults(defineProps<Props>(), {
  minRules: () => [],
  maxRules: () => []
});

/**
 * The options available for the minimum affiliation dropdown.
 * 
 * Computes an array of items for the select component, assigning the appropriate human-readable
 * label for each class year. Disables options that correspond to class years greater than the
 * user's own class year, as they must be comfortable matching with their own year.
 * 
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
  
  return UNDERGRADUATE_AFFILIATIONS.map((value, index): AffiliationSelectOption => {
    const option = AFFILIATION_OPTIONS.find((opt) => {
      return opt.value === value;
    });

    return {
      title: option ? option.label : value,
      value: value,
      props: {
        disabled: index > targetIndex
      }
    };
  });
});

/**
 * The options available for the maximum affiliation dropdown.
 * 
 * Computes an array of items for the select component, assigning the appropriate human-readable
 * label for each class year. Disables options that correspond to class years lesser than the
 * user's own class year, as they must be comfortable matching with their own year.
 * 
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
  
  return UNDERGRADUATE_AFFILIATIONS.map((value, index): AffiliationSelectOption => {
    const option = AFFILIATION_OPTIONS.find((opt) => {
      return opt.value === value;
    });

    return {
      title: option ? option.label : value,
      value: value,
      props: {
        disabled: index < targetIndex
      }
    };
  });
});

/**
 * Determines if the dropdowns should be completely disabled.
 * The dropdowns are only disabled if the user's target affiliation is null.
 * @returns True if the fields should be disabled, false otherwise.
 */
const isDisabled = computed(() => {
  if (props.targetAffiliation === null) {
    return true;
  }
  
  return false;
});

</script>
