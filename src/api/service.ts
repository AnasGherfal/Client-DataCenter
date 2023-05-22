import type { Service } from "../Modules/ServicesModule/ServicesModule";
import httpClient from ".";

export const serviceApi = {
  get: async function () {
    const response = await httpClient.get(`/Service`);
    return response;
  },
  create: async function (service: Service) {
    const response = await httpClient.post(`/Service`, service);
    return response;
  },
  remove: async function (id: number | null) {
    const response = await httpClient.delete(`/Service?id=${id}`);
    return response;
  },
  edit: async function (id: number | null, service: Service) {
    const response = await httpClient.put(`/Service?id=${id}`, service);
    return response;
  },
};
