<template>
  <FriendFormCard
    :label="props.label"
    :description="props.description"
    :required="isRequired"
    :error="isError"
    :shared="props.shared"
  >
    <VTextField
      v-model="model"
      v-model:error="isError"
      v-bind="$attrs"
      :rules="rules"
      :placeholder="placeholder"
      variant="underlined"
      color="primary"
      hide-details="auto"
    />
  </FriendFormCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<string | number | null>();

const isError = ref(false);

type Props = {
  label: string;
  description?: string;
  placeholder?: string;
  rules?: any[];
  shared?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => []
});

const isRequired = computed(() => {
  return props.rules.some(r => r.name === 'required' || r.toString().includes('required'));
});
</script>