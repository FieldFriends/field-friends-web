<template>
  <div
    class="friend-form-card position-relative"
    :style="cardStyles"
  >
    <div class="px-6 pt-5 pb-4">
      
      <div class="d-flex justify-space-between align-start mb-1 gap-4">
        
        <VLabel
          v-if="props.label"
          class="opacity-100 d-block friend-form-card__label flex-grow-1 mr-4"
        >
          {{  props.label }}
        </VLabel>

        <div class="d-flex ga-2 flex-shrink-0">
          <VChip
            v-if="!props.required"
            color="badge-optional"
            size="small"
            variant="tonal"
            class="font-weight-bold"
          >
            Optional
          </VChip>
          
          <template v-if="props.shared">
            <VChip
              color="badge-shared"
              size="small"
              variant="tonal"
              class="font-weight-bold"
            >
              Shared
            </VChip>
          </template>
          <template v-else>
            <VChip
              color="badge-optional"
              size="small"
              variant="tonal"
              class="font-weight-bold"
            >
              <VTooltip text="Not shared with your group" location="top">
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    icon="mdi-lock-outline"
                  />
                </template>
              </VTooltip>
            </VChip>
          </template>
        </div>
      </div>

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
  white-space: normal;
  height: auto;
  word-break: break-word; 
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
  label?: string;
  description?: string;
  required: boolean;
  error?: boolean;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  cornerRadius?: string | number;
  shared?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  required: true,
  fillColor: 'white',
  borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
  borderWidth: 1,
  cornerRadius: 10,
  shared: false
});

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