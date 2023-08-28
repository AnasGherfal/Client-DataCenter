import {httpClient} from "./index";
import type { Subscription } from "../Modules/SubscriptionModule/SubscriptionsRequestModule";

export const subscriptionApi = {
  get: async function () {
    const response = await httpClient.get(`/Subscription`);
    return response;
  },
  getById: async function (id:string) {
    const response = await httpClient.get(`/Subscription/${id}`);
    return response;
  },
  getFiltered: async function (pageNumber: number, pageSize: number, status: number){
    const response = await httpClient.get(`/Subscription?PageNumber=${pageNumber}&PageSize=${pageSize}&Status=${status}`);
    return response;
  },
  getFilteredCount: async function (){
    const response = await httpClient.get(`/Subscription/Filter`);
    return response;
  },
  getFile: async function (id: string) {
    const response = await httpClient.get(`/Subscription/${id}/Download`, { responseType: 'arraybuffer' });
    return response;
  },
  getPages: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Subscription?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    return response;
  },
  create: async function (subscription: FormData) {
    const response = await httpClient.post(`/subscription`, subscription);
    return response;
  },
  renew: async function (id: string | null, subscription: FormData) {
    const response = await httpClient.put(`/subscription/${id}/Renew`, subscription);
    return response;
  },
  edit: async function (id: string, service: Subscription) {
    const response = await httpClient.put(`/Service?id=${id}`, service);
    return response;
  },
};
