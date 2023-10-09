import { useHttpClient } from "@/network/httpClient";
import type { Service } from "../Modules/ServicesModule/ServicesModule";

const httpClient = useHttpClient();

export const serviceApi = {
  get: async function () {
    const response = await httpClient.get(`/Services`);
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Services/${id}`);
    return response;
  },
  create: async function (service: Service) {
    const response = await httpClient.post(`/Services`, service);
    return response;
  },
  remove: async function (id: any) {
    const response = await httpClient.delete(`/Services/${id}`);
    return response;
  },
  edit: async function (id: string | null, service: Service) {
    const response = await httpClient.put(`/Services/${id}`, service);
    return response;
  },
  block: async function (id: string) {
    const response = await httpClient.put(`/Services/${id}/lock`);
    return response;
  },

  unblock: async function (id: string) {
    const response = await httpClient.put(`/Services/${id}/unlock`);
    return response;
  },
};
