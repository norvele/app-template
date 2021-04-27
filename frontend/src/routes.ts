import { RouteRecordRaw } from "vue-router";
import { routesNames } from "@/routesNames";
import HomePage from "@/pages/home/Container.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: routesNames.home,
    component: HomePage,
  },
];
