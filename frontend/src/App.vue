<script lang="ts">
import { computed, defineComponent } from "vue";
import { useCommonStore } from "@/stores/common";

export default defineComponent({
  setup() {
    const commonStore = useCommonStore();

    return {
      isLoading: computed(() => commonStore.isLoading),
    };
  },
});
</script>

<template>
  <div>
    <div v-if="isLoading" class="loader" />
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/zIndex.scss";

@keyframes loader {
  0% {
    transform: translateX(-50%) scaleX(0);
  }
  10% {
    transform: translateX(-50%) scaleX(0.1);
  }
  50% {
    transform: translateX(0) scaleX(0.5);
  }
  90% {
    transform: translateX(50%) scaleX(0.1);
  }
  100% {
    transform: translateX(50%) scaleX(0);
  }
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: $color-white;
  overflow: hidden;
  z-index: z-index-overlay();

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-black;
    animation: loader 2s linear infinite;
  }
}
</style>

<style lang="scss">
@import "@/styles/color.scss";
@import "@/styles/typography.scss";

$scrollbar-track-color: transparent;
$scrollbar-thumb-color: $color-black;
$scrollbar-thumb-hover-color: $color-black;

// @font-face {
//   font-family: Poppins;
//   font-weight: 600;
//   src: url("@/assets/fonts/Poppins-SemiBold.ttf");
// }

body {
  // @include typography-main;
  margin: 0;
  padding: 0;
  color: $color-black;
}

#app {
  visibility: visible !important;
}

* {
  scrollbar-width: thin;
  scrollbar-color: $scrollbar-thumb-color $scrollbar-track-color;
}

*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  background: $scrollbar-track-color;
}

*::-webkit-scrollbar-thumb {
  background-color: $scrollbar-thumb-color;
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 6px;

  &:hover {
    background-color: $scrollbar-thumb-hover-color;
  }
}

*::-webkit-scrollbar-corner {
  background-color: $scrollbar-thumb-color;
  border: 2px solid transparent;
  background-clip: padding-box;
}
</style>
