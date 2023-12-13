<template>
  <v-app-bar app>
    <v-app-bar-title>Chat Moderation</v-app-bar-title>
    <v-spacer />
    <div v-if="userStore.user" class="user-container px-3">
      <v-avatar size="36">
        <v-img :src="userStore.user.profile_image_url" :alt="userStore.user.display_name" />
      </v-avatar>
      <span class="display-name ml-3">
        {{ userStore.user.display_name }}
      </span>
      <v-icon icon="mdi-chevron-down" class="ml-5" />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.user-container {
  height: 100%;
}

.user-container:hover {
  background: #0d47a1;
}
</style>
