import type { Representatives } from "../Modules/CustomerModule/RepresentativesModule/Representatives";
import {httpClient} from "./index";
//   'https://localhost:7030/v1.0/management/Representatives?CustomerId=cf61a267-00ce-4756-9079-abcebd376e5e&PageNumber=1&PageSize=5' 
export const representativesApi = {
  get: async function (customerId: string|undefined) {
    const response = await httpClient.get(`/Representatives?CustomerId=${customerId}`);
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Representatives/${id}/`);
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
