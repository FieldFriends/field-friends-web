<template>
  <friend-form-card
    :label="props.label"
    :description="props.description"
    :required="props.required"
    :shared="props.shared"
  >
    <template #default="{ labelId, descriptionId }">
      <v-radio-group
        v-model="model"
        v-bind="$attrs"
        :rules="rules"
        color="primary"
        hide-details="auto"
        class="mt-2"
        :aria-labelledby="labelId"
        :aria-describedby="descriptionId"
      >
        <slot />
      </v-radio-group>
    </template>
  </friend-form-card>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import FriendFormCard from './FriendFormCard.vue';

defineOptions({ inheritAttrs: false });

const id = useId();
const model = defineModel<any>();

type Props = {
  label: string;
  description?: string;
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