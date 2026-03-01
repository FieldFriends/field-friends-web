<template>
  <friend-form-card
    :label="props.label"
    :description="props.description"
    :required="props.required"
    :shared="props.shared"
    :input-id="id"
  >
    <template #default="{ descriptionId }">
      <v-select
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :rules="rules"
        :placeholder="placeholder"
        color="primary"
        bg-color="card"
        hide-details="auto"
        :aria-describedby="descriptionId"
      />

      <slot />
    </template>
  </friend-form-card>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const id = useId();
const model = defineModel();

type Props = {
  label: string;
  description?: string;
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