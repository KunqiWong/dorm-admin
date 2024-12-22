import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/check-out",
  meta: {
    title: $t("sidebar.checkOut"),
    icon: "flowbite:arrow-right-to-bracket-outline"
  },
  children: [
    {
      path: "/check-out",
      name: "CheckOut",
      component: () => import("@/views/check-out/index.vue"),
      meta: {
        title: $t("sidebar.checkOut"),
        roles: ["admin", "super", "common"]
      }
    }
  ]
};
