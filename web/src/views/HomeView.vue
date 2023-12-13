<template>
  <main>
    <SearchBar />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import api from '@/plugins/axios';
import router from '../router';
import useUserStore from '@/stores/user';
import SearchBar from '@/components/SearchBar.vue';

const userStore = useUserStore();

onMounted(() => {
  api
    .get('/user')
    .then(({ data }: { data: TwitchUser }) => {
      userStore.setUser(data);
    })
    .catch(() => {
      router.push({ name: 'login' });
    });
});
</script>
