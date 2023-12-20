<template>
  <div @click="logout" class="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';

const userStore = useUserStore();

function logout() {
  userStore.deleteUser();
  window.location.href = '/api/auth/logout';
}
</script>

<style scoped>
.container {
  cursor: pointer;
}
</style>
