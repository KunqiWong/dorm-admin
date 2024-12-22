import { $t, transformI18n } from "@/plugins/i18n";

export default {
  path: "/reports",
  meta: {
    title: $t("sidebar.reports"),
    icon: "flowbite:calendar-month-solid"
  },
  children: [
    {
      path: "/occupancy-rate",
      name: "OccupancyRate",
      component: () => import("@/views/reports/occupancy-rate/index.vue"),
      meta: {
        title: $t("sidebar.occupancyRate"),

        roles: ["admin", "super", "common"]
      }
    },
    {
      path: "/department-statistics",
      name: "DepartmentStatistics",
      component: () =>
        import("@/views/reports/department-statistics/index.vue"),
      meta: {
        title: $t("sidebar.departmentStatistics"),

        roles: ["admin", "super", "common"]
      }
    },
    {
      path: "/building-employee-info",
      name: "BuildingEmployeeInfo",
      component: () =>
        import("@/views/reports/building-employee-info/index.vue"),
      meta: {
        title: $t("sidebar.buildingEmployeeInfo"),

        roles: ["admin", "super", "common"]
      }
    }
  ]
};
