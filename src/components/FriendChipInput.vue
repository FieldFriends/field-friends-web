<template>
  <friend-form-card
    :label="props.label"
    :required="props.required"
    :shared="props.shared"
    :input-id="id"
  >
    <template #description>
      <slot name="description" />
    </template>
    <template #default="{ descriptionId }">
      <v-combobox
        ref="comboboxRef"
        :id="id"
        v-model="model"
        v-model:search="searchText"
        v-bind="$attrs"
        :rules="rules"
        :placeholder="placeholder"
        multiple
        chips
        closable-chips
        clearable
        hide-no-data
        variant="underlined"
        color="primary"
        bg-color="card"
        hide-details="auto"
        :aria-describedby="descriptionId"
        :delimiters="[', ']"
        @update:model-value="deduplicateModel"
        @keydown.capture="handleKeydown"
      >
        <template #append>
          <v-btn
            prepend-icon="mdi-plus"
            variant="tonal"
            color="primary"
            size="default"
            class="text-body-2"
            rounded="md"
            :disabled="buttonDisabled"
            @click.stop.prevent="addCurrentSearch"
          >
            {{ props.buttonText }}
          </v-btn>
        </template>
      </v-combobox>

      <div v-if="maxItemsReached" class="text-caption text-warning mt-2 font-weight-bold">
        Maximum number of items reached.
      </div>
      <div v-else-if="isSearchTextInvalid" class="text-caption text-error mt-2 font-weight-bold">
        {{ isSearchTextInvalid }}
      </div>

      <slot />
    </template>
  </friend-form-card>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { VCombobox } from 'vuetify/components';
import { transformItem } from 'vuetify/lib/composables/list-items.js';
import FriendFormCard from './FriendFormCard.vue';
import type { z } from 'zod';

defineOptions({ inheritAttrs: false });

const id = useId();
const model = defineModel<string[]>({ default: () => [] });
const searchText = ref('');
const comboboxRef = ref<InstanceType<typeof VCombobox> | null>(null);

type Props = {
  label: string;
  placeholder?: string;
  rules?: any[];
  shared?: boolean;
  required?: boolean;
  maxItems?: number;
  buttonText: string;
  itemSchema?: z.ZodTypeAny;
};

const props = withDefaults(defineProps<Props>(), {
  rules: () => [],
  shared: undefined,
  required: true,
  maxItems: 24,
});

const maxItemsReached = computed(() => {
  return model.value.length >= props.maxItems;
});

const isSearchTextInvalid = computed(() => {
  const text = searchText.value?.trim();

  if (!text || !props.itemSchema) {
    return false;
  }
  
  const result = props.itemSchema.safeParse(text);
  
  return result.success ? false : result.error.issues[0]?.message;
});

// FriendDev: Always show but disable button unless has text and valid length.
const buttonDisabled = computed(() => {
  const noSearchText = !searchText.value?.trim();

  return maxItemsReached.value || noSearchText || !!isSearchTextInvalid.value;
});

/**
 * Strip case-insensitive duplicate entries and invalid lengths from model.
 * @param newValue - The updated model from combobox.
 */
const deduplicateModel = (newValue: string[]) => {
  const existingItems = new Set<string>();
  const uniqueItems: string[] = [];

  for (const item of newValue) {
    const trimmed = item.trim();
    const normalized = trimmed.toLowerCase();

    if (!normalized || existingItems.has(normalized)) {
      continue;
    }

    if (props.itemSchema && !props.itemSchema.safeParse(trimmed).success) {
      continue;
    }

    existingItems.add(normalized);
    uniqueItems.push(trimmed);
  }

  // FriendDev: Enforce the max limit just in case.
  model.value = uniqueItems.slice(0, props.maxItems);
};

/**
 * Intercept keydown events before Vuetify processes them.
 * If the user presses Enter or a delimiter with invalid text,
 * we swallow the event to prevent Vuetify from clearing the input.
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    if (isSearchTextInvalid.value || maxItemsReached.value) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};

/**
 * Add current search text as new chip.
 */
const addCurrentSearch = () => {
  const trimmed = searchText.value?.trim();

  if (!trimmed || maxItemsReached.value || buttonDisabled.value || !comboboxRef.value) {
    return;
  }

  // FriendDev: Native way to add. A little icky but whatevs.
  const item = transformItem(comboboxRef.value.$props, trimmed);
  comboboxRef.value.select(item);
};
</script>