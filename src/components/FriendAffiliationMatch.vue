<template>
  <friend-form-card
    :label="props.label"
    :required="true"
    :shared="false"
  >
    <template #description>
      <slot name="description" />
    </template>
    
    <div class="d-flex flex-column ga-2 mt-2">
      <v-checkbox
        v-for="(affiliation, index) in UNDERGRADUATE_AFFILIATIONS"
        :key="affiliation"
        v-model="desiredAffiliations"
        :value="affiliation"
        :label="getAffiliationLabel(affiliation)"
        :disabled="isDisabled(affiliation)"
        :rules="getRulesForIndex(index)"
        color="primary"
        hide-details="auto"
      />
    </div>
  </friend-form-card>
</template>

<script setup lang="ts">
import FriendFormCard from './FriendFormCard.vue';
import { UNDERGRADUATE_AFFILIATIONS, AFFILIATION_OPTIONS } from '@shared/friendConfig';
import type { ProfileSubmission } from '@shared/schemas/profileSchema';

const desiredAffiliations = defineModel<ProfileSubmission['affiliation'][]>({ default: [] });

type Props = {
  label: string;
  targetAffiliation: ProfileSubmission['affiliation'] | null;
  rules?: any[];
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => []
});



/**
 * Retrieves the display label for a given affiliation value.
 * @param value - The affiliation value to lookup.
 * @returns The corresponding human-readable label.
 */
const getAffiliationLabel = (value: string): string => {
  const option = AFFILIATION_OPTIONS.find((opt) => {
    return opt.value === value;
  });

  if (option) {
    return option.label;
  }

  return value;
}

/**
 * Determines if a specific checkbox should be disabled.
 * @param affiliation - The affiliation value for the checkbox.
 * @returns True if the checkbox should be disabled, false otherwise.
 */
const isDisabled = (affiliation: string): boolean => {
  if (props.targetAffiliation === affiliation) {
    return true;
  }

  return false;
};

/**
 * Retrieves the validation rules for a specific checkbox index.
 * @param index - The current index of the checkbox in the list.
 * @returns The rules array if it is the last checkbox, otherwise undefined.
 */
const getRulesForIndex = (index: number): any[] | undefined => {
  if (index === UNDERGRADUATE_AFFILIATIONS.length - 1) {
    return props.rules;
  }

  return undefined;
};

</script>
