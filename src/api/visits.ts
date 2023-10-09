import type { Visit } from "../Modules/VisitModule/VisitResponseModule";
import type { VisitEdit } from "../Modules/VisitModule/VisitEditModule";

import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const visitApi = {
  get: async function (CustomerId?: string, SubscriptionId?: string) {
    const response = await httpClient.get(`/Visits`, {
      params: {
        CustomerId: CustomerId,
        SubscriptionId: SubscriptionId,
      },
    });
    return response;
  },

  getPages: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Visits`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });
    return response;
  },
  getTypes: async function () {
    const response = await httpClient.get(`/VisitTypes`);
    return response;
  },
  getById: async function (id: any) {
    const response = await httpClient.get(`/Visits/${id}`);
    return response;
  },
  create: async function (visit: Visit) {
    const response = await httpClient.post(`/Visits`, visit);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Visits/${id}`);
    return response;
  },
  start: async function (id: string, startTime: string) {
    const response = await httpClient.put(`/Visits/${id}/start`, {
      startTime,
    });
    return response;
  },

  stop: async function (id: string, endTime: string) {
    const response = await httpClient.put(`/Visits/${id}/stop`, {
      endTime,
    });
    return response;
  },
};
