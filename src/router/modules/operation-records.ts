import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/operation-records",
  meta: {
    title: $t("sidebar.operationRecords"),
    icon: "flowbite:clipboard-list-solid"
  },
  children: [
    {
      path: "/operation-records",
      name: "OperationRecords",
      component: () => import("@/views/operation-records/index.vue"),
      meta: {
        title: $t("sidebar.operationRecords"),
        roles: ["admin", "super", "common"]
      }
    }
  ]
};
