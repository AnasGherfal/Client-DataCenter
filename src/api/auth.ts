import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const authApi = {
  login: async function (credentials: any) {
    const response = await httpClient.post(`/Login`, credentials);
    return response;
  },
  resetPassword: async function (credentials: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const response = await httpClient.post(
      `/Auth/Change-Password`,
      credentials
    );
    return response;
  },
  profile: async function () {
    const response = await httpClient.get(`/Auth/Profile`);
    return response;
  },
  refreshToken: async function () {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await httpClient.post(`/Auth/refresh-token`, {
      refreshToken,
    });
    return response;
  },
};
