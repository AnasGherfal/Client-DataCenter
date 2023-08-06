import type { ResponseUserModel } from "../Modules/UserModule/UserModuleResponse";
import {httpClient} from "./index";

export const user = {
  getById: async function (id: any) {
    const response = await httpClient.get(`/User/${id}/Get`);
    return response;
  },
  get: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/User?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    return response;
  },
  create: async function (user: ResponseUserModel) {
    const response = await httpClient.post(`/user`, user);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/User/${id}/Delete`);
    return response;
  },
};
