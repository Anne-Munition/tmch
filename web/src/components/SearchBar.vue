<template>
  <v-autocomplete
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-no-data
    :loading="loading"
    @update:search="search"
    @click:clear="clear"
    @update:model-value="selected"
    :items="items"
    item-title="displayName"
    item-value="twitchId"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :title="item.raw.displayName" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { ref } from 'vue';

const loading = ref(false);
const items = ref<ViewerDoc[]>([]);

function search(val: string) {
  if (val.length !== 3) return;
  loading.value = true;
  api
    .get('/search/viewers', {
      params: {
        name: val,
      },
    })
    .then(({ data }: { data: ViewerDoc[] }) => {
      items.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
}

function clear() {}

function selected(thing) {
  console.log(thing);
}
</script>

<style scoped></style>
