import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  data: any;
};

export const getEmployeeList = (data: any) => {
  return http.request<Result>("post", baseUrlApi("staff/list"), { data });
};

export const getEmployeeAll = () => {
  return http.request<Result>("get", baseUrlApi("staff/all"));
};

export const saveEmployeeInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("staff/save"), { data });
};

export const deleteEmployeeInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("staff/delete"), { data });
};

export const saveBatchEmployeeInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("staff/saveBatch"), { data });
};
