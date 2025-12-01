<!-- <template>
  <div
    class="friend-form-card"
    v-bind="$attrs"
    :style="cardStyles"
  >
    <slot />
  </div>
</template> -->
<template>
  <div
    class="friend-form-card position-relative"
    :style="cardStyles"
  >
    <VChip
      color="primary"
      size="small"
      variant="tonal"
      class="position-absolute top-0 right-0 ma-4 font-weight-bold"
      style="z-index: 1;"
    >
      {{ badgeText }}
    </VChip>

    <div class="px-6 pt-5 pb-2">
      <VLabel
        v-if="props.label"
        class="opacity-100 mb-1 d-block"
      >
        {{  props.label }}
      </VLabel>

      <div
        v-if="props.description"
        class="mb-2 text-medium-emphasis"
        style="font-size: 0.925rem; line-height: 1.5;"
        v-html="props.description"
      />

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFriendColors } from '@/composables/useFriendColors';

const { resolveColor } = useFriendColors();

defineOptions({
  inheritAttrs: false
});

type Props = {
  label?: string
  description?: string
  required: boolean
  error?: string
  fillColor?: string
  borderColor?: string
  borderWidth?: string | number
  cornerRadius?: string | number
};

const props = withDefaults(defineProps<Props>(), {
  required: true,
  fillColor: 'white',
  borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
  borderWidth: 1,
  cornerRadius: 8
});

const badgeText = computed(() => {
  return props.required ? "Required" : "Optional";
})

const toUnit = (val: string | number) => {
  if (val === undefined || val === null) {
    return undefined;
  }

  return typeof val === 'number' ? `${val}px` : val;
};

const cardStyles = computed(() => {
  let activeBorderColor;
  let activeBorderWidth;

  if (props.error) {
    // @FriendDev: Consider making these props.
    activeBorderColor = 'error';
    activeBorderWidth = 2;
  } else {
    activeBorderColor = props.borderColor;
    activeBorderWidth = props.borderWidth;
  }

  return {
    backgroundColor: resolveColor(props.fillColor),
    borderColor: resolveColor(activeBorderColor),
    borderWidth: toUnit(props.borderWidth),
    borderRadius: toUnit(props.cornerRadius),
    borderStyle: 'solid',
    transition: 'border-color 0.2s ease'
  };
});
</script>

<style scoped>
.friend-form-card {
  display: block;
  box-sizing: border-box;
}
</style>