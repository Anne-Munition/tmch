import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: <TwitchUser>{},
    };
  },
  actions: {
    setUser(user: TwitchUser) {
      this.user = user;
    },
    deleteUser() {
      this.user = <TwitchUser>{};
    },
  },
});

export default useUserStore;
