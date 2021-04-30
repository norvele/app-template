<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute();
    const password = ref("");

    const submit = async () => {
      await axios.post("http://localhost:3001/auth/change-password", {
        code: route.params.code,
        password: password.value,
      });
    };

    return {
      password,
      submit,
    };
  },
});
</script>

<template>
  <div>
    <h1>Change password</h1>
    <form @submit.prevent="submit">
      <div>
        password:
        <input type="text" v-model="password" />
      </div>
      <button>Change</button>
    </form>
  </div>
</template>
