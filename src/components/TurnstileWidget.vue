<template>
  <div class="turnstile-widget d-flex justify-center my-0">
    <div ref="widgetContainer" />
  </div>
</template>

<style scoped>
.turnstile-widget {
  min-height: 65px;
}
</style>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useScriptTag } from '@vueuse/core';

export interface TurnstileWidgetProps {
  /**
   * The site key for the Turnstile widget that is provided by Cloudflare.
   */
  siteKey: string;
}

const props = defineProps<TurnstileWidgetProps>();

const getTurnstile = () => (globalThis as unknown as Window).turnstile;

const emit = defineEmits<{
  token: [token: string];
  expired: [];
  error: [error: unknown];
}>();

const widgetContainer = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);

const renderWidget = () => {
  if (!widgetContainer.value || !props.siteKey || !getTurnstile()) {
    return;
  }

  try {
    const id = getTurnstile().render(widgetContainer.value, {
      sitekey: props.siteKey,
      callback: (token: string) => emit('token', token),
      'expired-callback': () => emit('expired'),
      'error-callback': (err: any) => emit('error', err),
      theme: 'light',
      appearance: 'interaction-only'
    });
    
    if (id !== undefined) {
      widgetId.value = id;
    }
  } catch (error) {
    emit('error', error);
  }
};

const reset = () => {
  if (widgetId.value !== null && getTurnstile()) {
    getTurnstile().reset(widgetId.value);
  }
};

defineExpose({ reset });

useScriptTag(
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
  () => {
    renderWidget();
  },
  {
    defer: true
  }
);

onBeforeUnmount(() => {
  if (widgetId.value !== null && getTurnstile()) {
    getTurnstile().remove(widgetId.value);
  }
});
</script>
