
import { useHttpClient } from "@/network/httpClient";
import { RequestAdminModel } from "../Modules/AdminModule/AdminModuleRequest";

const httpClient = useHttpClient();

export const admin = {
  get: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Admins`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });
    return response;
  },
  getById: async function (id: any) {
    const response = await httpClient.get(`/Admins/${id}`);
    return response;
  },
  create: async function (admin: any) {
    const response = await httpClient.post(`/Admins`, admin);
    return response;
  },
  edit: async function (id: string, payload: number) {
    const response = await httpClient.put(`/Admins/${id}`, {
      permissions: payload,
    });
    return response;
  },

  remove: async function (id: string) {
    const response = await httpClient.delete(`/Admins/${id}`);
    return response;
  },

  block: async function (id: string) {
    const response = await httpClient.put(`/Admins/${id}/lock`);
    return response;
  },

  unblock: async function (id: string) {
    const response = await httpClient.put(`/Admins/${id}/unlock`);
    return response;
  },

  permissions: async function () {
    const response = await httpClient.get(`/Lists/admin-permissions`);
    return response;
  },
};
