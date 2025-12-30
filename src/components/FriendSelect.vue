<template>
  <FriendFormCard
    :label="props.label"
    :description="props.description"
    :required="isRequired"
    :error="isError"
    :shared="props.shared"
  >
    <!-- <VNumberInput
      v-model="model"
      v-model:error="isError"
      v-bind="$attrs"
      :rules="rules"
      :placeholder="placeholder"
      variant="underlined"
      color="primary"
      hide-details="auto"
    /> -->
    <VSelect
      v-model="model"
      v-model:error="isError"
      v-bind="$attrs"
      :rules="rules"
      :placeholder="placeholder"
      color="primary"
      hide-details="auto"
    />

    <slot />
  </FriendFormCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const model = defineModel();

const isError = ref(false);

type Props = {
  label: string;
  description?: string;
  placeholder?: string;
  rules?: any[];
  shared?: boolean | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => [],
  shared: undefined
});

// TODO @FriendDev: this sucks. centralize it.
const isRequired = computed(() => {
  return props.rules.some(r => r.name === 'required' || r.toString().includes('required'));
});
</script>