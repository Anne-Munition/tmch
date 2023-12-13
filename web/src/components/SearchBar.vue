<template>
  <v-autocomplete
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-no-data
    :loading="loading"
    @update:search="search"
    :items="items"
  />
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { ref } from 'vue';

const loading = ref(false);
const items = ref<string[]>([]);

function search(val: string) {
  if (val.length !== 3) return;
  loading.value = true;
  api
    .get('/search/viewers', {
      params: {
        name: val,
      },
    })
    .then(({ data }: { data: string[] }) => {
      items.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped></style>
