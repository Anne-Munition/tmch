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
        <LogoutSlot>
          <v-list-item>
            <v-btn color="red">
              <v-icon icon="mdi-logout" class="mr-2"></v-icon>
              Logout
            </v-btn>
          </v-list-item>
        </LogoutSlot>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/user';
import LogoutSlot from '@/components/slots/LogoutSlot.vue';

const userStore = useUserStore();

function logout() {}
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
