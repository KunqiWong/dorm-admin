import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  data: any;
};

export const getOperationList = (data: any) => {
  return http.request<Result>("post", baseUrlApi("log/list"), { data });
};

export const getOperationAll = () => {
  return http.request<Result>("get", baseUrlApi("log/all"));
};
