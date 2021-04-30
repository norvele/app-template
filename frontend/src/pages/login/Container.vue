<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { useCommonStore } from "@/stores/common";

export default defineComponent({
  components: {},
  setup() {
    const commonStore = useCommonStore();
    const email = ref("");
    const password = ref("");

    const submit = async () => {
      const result = await axios.post<{ token: string }>(
        "http://localhost:3001/auth/login",
        {
          email: email.value,
          password: password.value,
        }
      );
      commonStore.userToken = result.data.token;
      await commonStore.fetchUserInfo();
    };

    const resend = async () => {
      await axios.post("http://localhost:3001/auth/resend-verify-email", {
        email: email.value,
        password: password.value,
      });
    };

    const reset = async () => {
      await axios.post("http://localhost:3001/auth/reset-password", {
        email: email.value,
      });
    };

    return {
      email,
      password,
      submit,
      resend,
      reset,
    };
  },
});
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <div>
        email:
        <input type="text" v-model="email" />
      </div>
      <div>
        password:
        <input type="text" v-model="password" />
      </div>
      <button>Login</button>
      <button type="button" @click="resend">Resend verify email</button>
      <button type="button" @click="reset">Reset password</button>
    </form>
  </div>
</template>
