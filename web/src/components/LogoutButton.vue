<template>
  <v-btn @click="logout">Logout</v-btn>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';

const userStore = useUserStore();

function logout() {
  userStore.deleteUser();
  window.location.href = '/api/auth/logout';
}
</script>

<style scoped></style>
