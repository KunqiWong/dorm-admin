import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/check-in",
  meta: {
    title: $t("sidebar.checkIn"),
    icon: "flowbite:clipboard-check-solid"
  },
  children: [
    {
      path: "/check-in",
      name: "CheckIn",
      component: () => import("@/views/check-in/index.vue"),
      meta: {
        title: $t("sidebar.checkIn"),
        roles: ["admin", "super", "common"]
      }
    }
  ]
};
