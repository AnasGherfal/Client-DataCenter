import {httpClient} from "./index";
import type { Visit } from "../Modules/VisitModule/VisitResponseModule";
import type { VisitEdit } from "../Modules/VisitModule/VisitEditModule";
export const visitApi = {




  get: async function () {
    const response = await httpClient.get(
      `/Visit`
    );
    return response;
  },

  getPages: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(
      `/Visit?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response;
  },
  create: async function (visit: Visit) {
    const response = await httpClient.post(`/Visit`, visit);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Visit/${id}`);
    return response;
  },
  edit: async function (id: string, visit: VisitEdit) {
    const response = await httpClient.put(`/Visit/${id}`, visit);
    return response;
  },
};
