import { SubscriptionStatus } from "@/constant/SubscriptionStatus";
import type { Subscription } from "../Modules/SubscriptionModule/SubscriptionsRequestModule";
import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const subscriptionApi = {
  get: async function (pageNumber = 1, pageSize = 10, CustomerId: string) {
    const response = await httpClient.get(`/Subscriptions`, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        CustomerId: CustomerId,
      },
    });
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Subscriptions/${id}`);
    return response;
  },
  getFiltered: async function (
    pageNumber: number,
    pageSize: number,
    status: SubscriptionStatus
  ) {
    const response = await httpClient.get(`/Subscriptions`, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        status,
      },
    });
    return response;
  },

  getFile: async function (id: string, fileId: string) {
    const response = await httpClient.get(
      `/Subscriptions/${id}/document/${fileId}`,
      {
        responseType: "arraybuffer",
      }
    );
    return response;
  },
  getPages: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Subscriptions`, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
    });
    return response;
  },
  create: async function (subscription: FormData) {
    const response = await httpClient.post(`/subscriptions`, subscription, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  renew: async function (id: string, payload: FormData) {
    const response = await httpClient.put(
      `/subscriptions/${id}/Renew`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },
  block: async function (id: string) {
    const response = await httpClient.put(`/subscriptions/${id}/lock`);
    return response;
  },

  unblock: async function (id: string) {
    const response = await httpClient.put(`/subscriptions/${id}/unlock`);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/subscriptions/${id}`);
    return response;
  },
};
