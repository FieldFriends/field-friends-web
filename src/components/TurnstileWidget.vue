<template>
  <div class="d-flex justify-center my-0">
    <div ref="widgetContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const getTurnstile = () => (globalThis as unknown as Window).turnstile;

const emit = defineEmits<{
  token: [token: string];
  expired: [];
  error: [error: any];
}>();

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const widgetContainer = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);

if (!siteKey) {
  emit('error', 'Missing Turnstile site key.');
}

const renderWidget = () => {
  if (!widgetContainer.value || !siteKey || !getTurnstile()) {
    return;
  }

  try {
    const id = getTurnstile().render(widgetContainer.value, {
      sitekey: siteKey,
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

onMounted(() => {
  if (getTurnstile()) {
    renderWidget();
  } else {
    document.addEventListener('turnstileLoaded', renderWidget, { once: true });
  }
});

onBeforeUnmount(() => {
  if (widgetId.value !== null && getTurnstile()) {
    getTurnstile().remove(widgetId.value);
  }
});
</script>
