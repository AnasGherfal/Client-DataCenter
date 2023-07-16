import type { Representatives } from "../Modules/CustomerModule/RepresentativesModule/Representatives";
import {httpClient} from "./index";

export const representativesApi = {
  get: async function () {
    const response = await httpClient.get(`/Representatives`);
    return response;
  },
  create: async function (representives: Representatives) {
    const response = await httpClient.post("/Representatives", representives);
    return response;
  },
  remove: async function (id: number) {
    const response = await httpClient.delete(`/Representatives/${id}`);
    return response;
  },
};
