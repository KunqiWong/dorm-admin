import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  data: any;
};

export const getCheckoutList = (data: any) => {
  return http.request<Result>("post", baseUrlApi("checkout/getCheckOutList"), {
    data
  });
};

export const selectLeaveInfoAll = () => {
  return http.request<Result>("get", baseUrlApi("checkout/all"));
};
