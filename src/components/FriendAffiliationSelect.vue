<template>
  <friend-select
    v-model="model"
    class="mb-4"
    label="University Affiliation"
    placeholder="Select your affiliation"
    variant="underlined"
    bg-color="white"
    :items="affiliationSelectItems"
    :shared="false"
  >
    <template #item="{ props, item }">
      <v-divider v-if="item.raw.type === SelectMenuElementType.Divider" class="my-2 mx-3 border-opacity-25" color="secondary" />
      <v-list-subheader v-else-if="item.raw.type === SelectMenuElementType.Header" class="text-primary font-weight-bold">
        {{ item.raw.title }}
      </v-list-subheader>
      <v-list-item v-else v-bind="props" />
    </template>
  </friend-select>
</template>

<script setup lang="ts">
import FriendSelect from './FriendSelect.vue';
import { SelectMenuElementType } from '@/types/ui';
import { generateAffiliationSelectItems } from '@/pages/SignUpFormHelpers';

const model = defineModel<string | null>();
const affiliationSelectItems = generateAffiliationSelectItems();
</script>
