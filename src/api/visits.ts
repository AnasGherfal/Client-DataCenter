import httpClient from ".";
import type { Visit } from "../Modules/VisitModule/VisitResponseModule";

export const visitApi = {
  get: async function () {
    const response = await httpClient.get(`/Visit`);
    return response;
  },
  create: async function (visit: Visit) {
    const response = await httpClient.post(`/Visit`, visit);
    return response;
  },
  remove: async function (id: number) {
    const response = await httpClient.delete(`/Visit/${id}`);
    return response;
  },
  edit: async function (id: number, visit: Visit) {
    const response = await httpClient.put(`/Visit/${id}`, visit);
    return response;
  },
};
