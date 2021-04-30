import { defineStore } from "pinia";
import axios from "axios";

interface UserInfo {
  name: string;
  email: string;
}

export const useCommonStore = defineStore({
  id: "common",
  state: () => ({
    loadingCount: 0,
    userToken: "",
    userInfo: undefined as UserInfo | undefined,
  }),
  getters: {
    isLoading() {
      return this.loadingCount > 0;
    },
  },
  actions: {
    async fetchUserInfo() {
      const result = await axios.get<UserInfo>(
        "http://localhost:3001/auth/info",
        {
          headers: {
            authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      this.userInfo = result.data;
    },
  },
});
