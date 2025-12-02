<template>
  <div
    class="friend-form-card position-relative"
    :style="cardStyles"
  >
    <VChip
      v-if="!props.required"
      :color="badgeColor"
      size="small"
      variant="tonal"
      class="position-absolute top-0 right-0 ma-4 font-weight-bold"
    >
      {{ badgeText }}
    </VChip>

    <div class="px-6 pt-5 pb-4">
      <VLabel
        v-if="props.label"
        class="opacity-100 mb-1 d-block friend-form-card__label"
      >
        {{  props.label }}
      </VLabel>

      <div
        v-if="props.description"
        class="mb-2 friend-form-card__description"
        v-html="props.description"
      />

      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.friend-form-card__label {
  font-size: 1.25rem;
}

.friend-form-card__description {
  font-size: 0.975rem;
  line-height: 1.3;
  opacity: 80%;
}
</style>

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
  error?: boolean
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
  cornerRadius: 10
});

// FriendDev: Kinda useless now since I added the v-if, but whatevs.
//            I found it too visually noisy to have 'Required' on each card.
const badgeText = computed(() => {
  return props.required ? "Required" : "Optional";
})

const badgeColor = computed(() => {
  return props.required ? "badge-required" : "badge-optional";
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
    activeBorderWidth = 4;
  } else {
    activeBorderColor = props.borderColor;
    activeBorderWidth = props.borderWidth;
  }

  return {
    backgroundColor: resolveColor(props.fillColor),
    borderColor: resolveColor(activeBorderColor),
    borderWidth: toUnit(activeBorderWidth),
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
  margin-bottom: 12px;
}
</style>