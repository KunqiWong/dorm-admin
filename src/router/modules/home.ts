import { $t, transformI18n } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/building",
  meta: {
    icon: "ep:home-filled",
    title: $t("sidebar.building"),
    rank: 0
  },
  children: [
    {
      path: "/building",
      name: "Building",
      component: () => import("@/views/building/index.vue"),
      meta: {
        title: $t("sidebar.building"),
        roles: ["admin", "super"]
      }
    }
  ]
};
