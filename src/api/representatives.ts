import type { Representatives } from "../Modules/CustomerModule/RepresentativesModule/Representatives";
import {httpClient} from "./index";

export const representativesApi = {
  get: async function () {
    const response = await httpClient.get(`/Representatives`);
    return response;
  },
  getFile: async function (id: string) {
    const response = await httpClient.get(`/Representatives/${id}/Download`, { responseType: 'arraybuffer' });
    return response;
  },
  create: async function (representatives: FormData) {
    const response = await httpClient.post("/Representatives", representatives);
    return response;
  },
  edit:async function ( id: string ,representatives: any) {
    const response = await httpClient.put(`/Representatives/${id}`, representatives);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Representatives/${id}`);
    return response;
  },
};
