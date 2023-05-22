import type { ResponseUserModel } from "../Modules/UserModule/UserModuleResponse";
import httpClient from ".";

export const user = {
  getById: async function (id: any) {
    const response = await httpClient.get(`/User/${id}/Get`);
    return response;
  },
  get: async function () {
    const response = await httpClient.get(`/User`);
    return response;
  },
  create: async function (user: ResponseUserModel) {
    const response = await httpClient.post(`/user`, user);
    return response;
  },
  remove: async function (id: number) {
    const response = await httpClient.delete(`/User/${id}/Delete`);
    return response;
  },
};
