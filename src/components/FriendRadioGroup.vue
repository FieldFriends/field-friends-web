<template>
  <FriendFormCard
    :label="props.label"
    :description="props.description"
    :required="isRequired"
    :error="isError"
    :shared="props.shared"
  >
    <VRadioGroup
      v-model="model"
      v-model:error="isError"
      v-bind="$attrs"
      :rules="rules"
      color="primary"
      hide-details="auto"
      class="mt-2"
    >
      <slot />
    </VRadioGroup>
  </FriendFormCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<any>();
const isError = ref(false);

type Props = {
  label: string;
  description?: string;
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