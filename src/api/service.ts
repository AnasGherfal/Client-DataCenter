import type { Service } from "../Modules/ServicesModule/ServicesModule";
import {httpClient} from "./index";

export const serviceApi = {
  get: async function () {
    const response = await httpClient.get(`/Service`);
    return response;
  },
  getById: async function (id:string) {
    const response = await httpClient.get(`/Service/${id}`);
    return response;
  },
  create: async function (service: Service) {
    const response = await httpClient.post(`/Service`, service);
    return response;
  },
  remove: async function (id: string ) {
    const response = await httpClient.delete(`/Service/${id}`);
    return response;
  },
  edit: async function (id: string | null, service: Service) {
    const response = await httpClient.put(`/Service/${id}`, service);
    return response;
  },
};
