import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type UserResult = {
  code: number;
  data: {
    /** 头像 */
    // avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    // refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  code: number;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("admin/login"), { data });
};

export const getAdminList = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("admin/list"), { data });
};
export const changeAdmin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("admin/change"), { data });
};
export const createAdmin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("admin/create"), { data });
};
export const resetAdmin = (data?: string) => {
  return http.request<UserResult>("get", baseUrlApi(`admin/reset/${data}`));
};
/** 刷新`token` */
// export const refreshTokenApi = (data?: object) => {
//   return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
// };
