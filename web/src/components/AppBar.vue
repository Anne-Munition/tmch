<template>
  <v-app-bar app dense>
    <v-app-bar-title>Chat History</v-app-bar-title>
    <v-spacer />
    <v-menu>
      <template v-slot:activator="{ props }">
        <div v-if="userStore.user" class="user-container px-3">
          <v-avatar size="36">
            <v-img :src="userStore.user.profile_image_url" :alt="userStore.user.display_name" />
          </v-avatar>
          <span class="display-name ml-3">
            {{ userStore.user.display_name }}
          </span>
          <v-icon icon="mdi-chevron-down" class="ml-5" v-bind="props" />
        </div>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.user-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.user-container:hover {
  background: #4978c1;
}
</style>
