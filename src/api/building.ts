import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  data: any;
};

export const getBuildingList = (data: any) => {
  return http.request<Result>("post", baseUrlApi("building/list"), { data });
};

export const getBuildingAll = () => {
  return http.request<Result>("get", baseUrlApi("building/all"));
};

export const saveBuildingInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("building/save"), { data });
};

export const deleteBuildingInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("building/delete"), { data });
};

export const saveBatchBuildingInfo = (data: any) => {
  return http.request<Result>("post", baseUrlApi("building/saveBatch"), {
    data
  });
};

export const getBuildingRoom = (data: any) => {
  return http.request<Result>("post", baseUrlApi("building/selectRoom"), {
    data
  });
};
