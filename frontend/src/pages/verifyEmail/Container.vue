<script lang="ts">
import { defineComponent, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute();

    const verify = async () => {
      await axios.post("http://localhost:3001/auth/verify-email", {
        code: route.params.code,
      });
    };

    onMounted(() => {
      verify();
    });

    return {
      verify,
    };
  },
});
</script>

<template>
  <div>
    <h1>Verify email</h1>
  </div>
</template>
