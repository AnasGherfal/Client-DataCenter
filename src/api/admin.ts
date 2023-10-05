import type { ResponseAdminModel } from "@/Modules/AdminModule/AdminModuleResponse";
import {httpClient} from "./index";
import {isAuthorized, getToken} from "@/auth"

const token = getToken();
export const admin = {
  get: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Admins?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
      headers: {
          Authorization:` bearer ${token}`,
      }
    });
    return response;
  },
  getById: async function (id: any) {
    const response = await httpClient.get(`/Admins/${id}`);
    return response;
  },
  create: async function (admin: ResponseAdminModel) {
    const response = await httpClient.post(`/Admins`, admin);
    return response;
  },
  edit:async function (id: string) {
    const response = await httpClient.put(`/Admins/${id}`);
    return response;
  },

  remove: async function (id: string) {
    const response = await httpClient.delete(`/Admins/${id}`);
    return response;
  },

  permissions: async function (){
    const response = await httpClient.get(`/Lists/admin-permissions`);
    return response;
  }
};
