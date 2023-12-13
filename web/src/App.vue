<template>
  <v-app>
    <v-main>
      <AppBar />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
</script>

<style scoped></style>
