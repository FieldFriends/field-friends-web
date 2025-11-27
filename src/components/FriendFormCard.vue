<template>
  <div
    class="friend-form-card"
    v-bind="$attrs"
    :style="cardStyles"
  >
    <slot />
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
  fillColor?: string
  borderColor?: string
  borderWidth?: string | number
  cornerRadius?: string | number
};

const props = withDefaults(defineProps<Props>(), {
  fillColor: 'white',
  borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
  borderWidth: 1,
  cornerRadius: 8
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
    borderStyle: 'solid'
  };
});
</script>

<style scoped>
.friend-form-card {
  display: block;
  box-sizing: border-box;
}
</style>