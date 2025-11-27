<template>
  <VLabel 
    class="opacity-100 mb-1" 
    :style="{ color: resolvedLabelColor, fontSize: '1.2rem' }"
    :for="id"
  >
    {{ props.label }}
  </VLabel>

  <div 
    v-if="props.description" 
    v-html="props.description" 
    class="mb-2"
    :style="{ fontSize: '0.9rem' }"
    :id="`${id}-desc`"
  />

  <VTextField
    v-model="model"
    v-bind="$attrs"
    :id="id"
    :aria-describedby="props.description ? `${id}-desc` : undefined"
    :aria-label="props.label"
  />
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { useFriendColors } from '@/composables/useFriendColors';

type Props = {
  label: string
  labelColor?: string,
  description?: string,
};

const props = withDefaults(defineProps<Props>(), {
  labelColor: 'form-text'
});

// FriendDev: Disable inheritence and manually bind the attributes to the text field.
defineOptions({
  inheritAttrs: false,
})

const model = defineModel<string>();

const { resolveColor } = useFriendColors();

const resolvedLabelColor = computed(() => {
  return resolveColor(props.labelColor);
});

const id = useId();
</script>