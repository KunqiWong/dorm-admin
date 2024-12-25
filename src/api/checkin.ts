import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  data: any;
};

export const getBuildingTreeData = () => {
  return http.request<Result>("get", baseUrlApi("checkin//treeselect"));
};

export const getEmployeeListByBuilding = (data: any) => {
  return http.request<Result>(
    "post",
    baseUrlApi("checkin/employeeListByBuilding"),
    { data }
  );
};

export const getInfoRest = (data: any) => {
  return http.request<Result>("post", baseUrlApi("checkin/infoRest"), { data });
};

export const exchangeStaffRoom = (data: any) => {
  return http.request<Result>("post", baseUrlApi("checkin/exchangeStaffRoom"), {
    data
  });
};

export const exchangeRoomApply = (data: any) => {
  return http.request<Result>("post", baseUrlApi("checkin/exchangeRoomApply"), {
    data
  });
};