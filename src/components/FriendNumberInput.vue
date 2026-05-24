<template>
  <friend-form-card
    :label="props.label"
    :required="props.required"
    :shared="props.shared"
  >
    <template #description>
      <slot name="description" />
    </template>
    <v-number-input
      v-model="model"
      v-bind="$attrs"
      :rules="rules"
      :placeholder="placeholder"
      variant="underlined"
      color="primary"
      hide-details="auto"
    />

    <slot />
  </friend-form-card>
</template>

<script setup lang="ts">
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<number | null>();

type Props = {
  label: string;
  placeholder?: string;
  rules?: any[];
  shared?: boolean | undefined;
  required?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => [],
  shared: undefined,
  required: true
});
</script>