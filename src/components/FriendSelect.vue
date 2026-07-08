<template>
  <friend-form-card
    :label="props.label"
    :required="props.required"
    :shared="props.shared"
    :input-id="id"
  >
    <template #description>
      <slot name="description" />
    </template>
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
      >
        <template v-if="$slots.item" #item="slotData">
          <slot name="item" v-bind="slotData" />
        </template>
      </v-select>

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