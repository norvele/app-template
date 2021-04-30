<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  components: {},
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");

    const submit = async () => {
      await axios.post("http://localhost:3001/auth/register", {
        name: name.value,
        email: email.value,
        password: password.value,
      });
    };

    return {
      name,
      email,
      password,
      submit,
    };
  },
});
</script>

<template>
  <div>
    <h1>Registration</h1>
    <form @submit.prevent="submit">
      <div>
        name:
        <input type="text" v-model="name" />
      </div>
      <div>
        email:
        <input type="text" v-model="email" />
      </div>
      <div>
        password:
        <input type="text" v-model="password" />
      </div>
      <button>Register</button>
    </form>
  </div>
</template>
