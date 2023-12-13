<template>
  <v-btn @click="login">Login</v-btn>
</template>

<script setup lang="ts">
function login() {
  window.location.href = '/api/auth/login';
}
</script>

<style scoped></style>
