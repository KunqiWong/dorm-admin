import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/employee-search",
  meta: {
    title: $t("sidebar.employeeSearch"),
    icon: "flowbite:address-book-solid"
  },
  children: [
    {
      path: "/employee-search",
      name: "EmployeeSearch",
      component: () => import("@/views/employee-search/index.vue"),
      meta: {
        title: $t("sidebar.employeeSearch"),
        roles: ["admin", "super", "common"]
      }
    }
  ]
};
