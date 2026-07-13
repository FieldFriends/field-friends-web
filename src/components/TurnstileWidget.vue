<template>
  <div class="turnstile-wrapper d-flex justify-center my-0">
    <div 
      class="turnstile-widget"
      :class="{ 'turnstile-widget--hidden': !isInteractive }"
    >
      <div ref="widgetContainer" />
    </div>
  </div>
</template>

<style scoped>
.turnstile-wrapper {
  min-height: 65px;
}

.turnstile-widget--hidden {
  display: none !important;
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
const isInteractive = ref(false);

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
      // FriendDev: Hide container when non-interactive to prevent capturing keyboard focus.
      'before-interactive-callback': () => {
        isInteractive.value = true;
      },
      // 'after-interactive-callback': () => {
      //   isInteractive.value = false;
      // },
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
    isInteractive.value = false;
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
