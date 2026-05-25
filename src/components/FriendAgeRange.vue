<template>
  <friend-form-card
    :label="props.label"
    :required="props.required"
    :shared="props.shared"
  >
    <template #description>
      <slot name="description" />
    </template>
    
    <div class="d-flex flex-column flex-sm-row ga-4 w-100">
      <v-number-input
        v-model="minAge"
        :rules="props.minRules"
        :min="props.minLimit"
        :max="props.targetAge ?? props.maxLimit"
        :disabled="isDisabled"
        label="Min Age"
        variant="underlined"
        color="primary"
        hide-details="auto"
        class="flex-1-1-100"
      />
      
      <v-number-input
        v-model="maxAge"
        :rules="props.maxRules"
        :min="props.targetAge ?? props.minLimit"
        :max="props.maxLimit"
        :disabled="isDisabled"
        label="Max Age"
        variant="underlined"
        color="primary"
        hide-details="auto"
        class="flex-1-1-100"
      />
    </div>

    <slot />
  </friend-form-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const minAge = defineModel<number | null>('minAge');
const maxAge = defineModel<number | null>('maxAge');

type Props = {
  label: string;
  targetAge: number | null;
  minLimit: number;
  maxLimit: number;
  minRules?: any[];
  maxRules?: any[];
  shared?: boolean | undefined;
  required?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  minRules: () => [],
  maxRules: () => [],
  shared: undefined,
  required: true
});

const K_MIN = 0.4;
const K_MAX = 0.4;
const DEFAULT_OFFSET = 2;
const CUTOFF_AGE = 25;

/**
 * Calculates the recommended minimum age based on the target age.
 * @param targetAge - The user's actual age.
 * @param minLimit - The absolute minimum allowable age in the system.
 * @returns The calculated default minimum age.
 */
function calculateMinAge(targetAge: number, minLimit: number): number {
  const penalty = Math.max(0, targetAge - CUTOFF_AGE);
  const diff = DEFAULT_OFFSET + (K_MIN * penalty);
  const value = Math.round(targetAge - diff);
  
  if (value < minLimit) {
    return minLimit;
  }
  
  return value;
}

/**
 * Calculates the recommended maximum age based on the target age.
 * @param targetAge - The user's actual age.
 * @param maxLimit - The absolute maximum allowable age in the system.
 * @returns The calculated default maximum age.
 */
function calculateMaxAge(targetAge: number, maxLimit: number): number {
  const penalty = Math.max(0, targetAge - CUTOFF_AGE);
  const diff = DEFAULT_OFFSET + (K_MAX * penalty);
  const value = Math.round(targetAge + diff);
  
  if (value > maxLimit) {
    return maxLimit;
  }
  
  return value;
}

const isDisabled = computed(() => {
  if (props.targetAge === null) {
    return true;
  }
  
  if (props.targetAge < props.minLimit || props.targetAge > props.maxLimit) {
    return true;
  }
  
  return false;
});

watch(
  () => props.targetAge,
  (newTargetAge) => {
    // FriendDev: Only update if target age is valid.
    if (newTargetAge !== null && newTargetAge >= props.minLimit && newTargetAge <= props.maxLimit) {
      minAge.value = calculateMinAge(newTargetAge, props.minLimit);
      maxAge.value = calculateMaxAge(newTargetAge, props.maxLimit);
    } else {
      // FriendDev: Clear values if target age becomes invalid.
      minAge.value = null;
      maxAge.value = null;
    }
  }
);
</script>
