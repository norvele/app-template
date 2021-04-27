import { createPinia } from "pinia";
import App from "./App.vue";
import { routes } from "./routes";
import viteSSR from "vite-ssr";

export default viteSSR(App, { routes }, ({ app, router }) => {
  const pinia = createPinia();
  pinia.use(() => ({
    router,
  }));
  app.use(pinia);
});
