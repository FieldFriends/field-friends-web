<template>
  <div
    class="friend-form-card position-relative font-roboto"
    :style="cardStyles"
  >
    <div class="px-6 pt-5 pb-4">
      
      <div class="d-flex justify-space-between align-start mb-1 gap-4">
        
        <v-label
          v-if="props.label"
          :id="labelId"
          :for="props.inputId"
          class="opacity-100 d-block friend-form-card__label flex-grow-1 mr-4"
        >
          {{  props.label }}
        </v-label>

        <div class="d-flex flex-column flex-sm-row ga-2 flex-shrink-0 align-end">
          <v-chip
            v-if="!props.required"
            color="badge-optional"
            size="small"
            variant="tonal"
            class="font-weight-bold"
          >
            Optional
          </v-chip>
          
          <template v-if="props.shared === true">
            <v-tooltip text="What you enter will be shared with your group" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-chip
                  v-bind="tooltipProps"
                  color="badge-shared"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Shared
                </v-chip>
              </template>
            </v-tooltip>
          </template>
          <template v-if="props.shared === false">
            <v-tooltip text="What you enter will not be shared with your group" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-chip
                  v-bind="tooltipProps"
                  color="badge-optional"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  Not shared
                </v-chip>
              </template>
            </v-tooltip>
          </template>
        </div>
      </div>

      <div
        v-if="props.description"
        :id="descriptionId"
        class="mb-2 friend-form-card__description"
        v-html="props.description"
      />

      <slot :label-id="labelId" :description-id="descriptionId" />
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
import { computed, useId } from 'vue';
import { useFriendColors } from '@/composables/useFriendColors';

const { resolveColor } = useFriendColors();
const labelId = useId();
const descriptionId = useId();

defineOptions({
  inheritAttrs: false
});

type Props = {
  label?: string;
  inputId?: string;
  description?: string;
  required: boolean;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  cornerRadius?: string | number;
  shared?: boolean | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  required: true,
  fillColor: 'card',
  borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
  borderWidth: 1,
  cornerRadius: 10,
  shared: undefined
});

const toUnit = (val: string | number) => {
  if (val === undefined || val === null) {
    return undefined;
  }

  return typeof val === 'number' ? `${val}px` : val;
};

const cardStyles = computed(() => {
  return {
    backgroundColor: resolveColor(props.fillColor),
    borderColor: resolveColor(props.borderColor),
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
  margin-bottom: 12px;
}
</style>