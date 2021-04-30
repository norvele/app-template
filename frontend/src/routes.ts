import { RouteRecordRaw } from "vue-router";
import { routesNames } from "@/routesNames";
import HomePage from "@/pages/home/Container.vue";
import RegistrationPage from "@/pages/registration/Container.vue";
import LoginPage from "@/pages/login/Container.vue";
import VerifyEmailPage from "@/pages/verifyEmail/Container.vue";
import ChangePasswordPage from "@/pages/changePassword/Container.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: routesNames.home,
    component: HomePage,
  },
  {
    path: "/registration",
    name: routesNames.registration,
    component: RegistrationPage,
  },
  {
    path: "/login",
    name: routesNames.login,
    component: LoginPage,
  },
  {
    path: "/verify-email/:code",
    name: routesNames.verifyEmail,
    component: VerifyEmailPage,
  },
  {
    path: "/change-password/:code",
    name: routesNames.changePassword,
    component: ChangePasswordPage,
  },
];
