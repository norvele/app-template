import { defineStore } from "pinia";

export const useCommonStore = defineStore({
  id: "common",
  state: () => ({
    loadingCount: 0,
  }),
  getters: {
    isLoading() {
      return this.loadingCount > 0;
    },
  },
  actions: {},
});
