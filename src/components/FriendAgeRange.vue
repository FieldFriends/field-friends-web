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
import { computed } from 'vue';
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


const isDisabled = computed(() => {
  if (props.targetAge === null) {
    return true;
  }
  
  if (props.targetAge < props.minLimit || props.targetAge > props.maxLimit) {
    return true;
  }
  
  return false;
});

</script>
