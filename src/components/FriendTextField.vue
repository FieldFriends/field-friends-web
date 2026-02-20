<template>
  <template v-if="props.showCard">
    <friend-form-card
      :label="props.label"
      :description="props.description"
      :required="props.required"
      :shared="props.shared"
      :input-id="id"
    >
      <template #default="{ descriptionId }">
        <v-text-field
          :id="id"
          v-model="model"
          v-bind="$attrs"
          :rules="rules"
          :placeholder="placeholder"
          variant="underlined"
          color="primary"
          hide-details="auto"
          :aria-describedby="descriptionId"
        />

        <slot />
      </template>
    </friend-form-card>
  </template>
  <template v-else>
    <v-text-field
      v-model="model"
      v-bind="$attrs"
      :rules="rules"
      :placeholder="placeholder"
      variant="underlined"
      color="primary"
      hide-details="auto"
    />
  </template>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const id = useId();
const model = defineModel<string | number | null>();

type Props = {
  label?: string;
  description?: string;
  placeholder?: string;
  rules?: any[];
  shared?: boolean | undefined;
  required?: boolean;
  showCard?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => [],
  shared: undefined,
  required: true,
  showCard: true
});
</script>