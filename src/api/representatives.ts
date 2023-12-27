import type { Representatives } from "../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const representativesApi = {
  get: async function (CustomerId: string) {
    const response = await httpClient.get(`/Representatives`, {
      params: {
        CustomerId: CustomerId,
      },
    });
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Representatives/${id}`);
    return response;
  },
  getFile: async function (id: string, fileId: string) {
    const response = await httpClient.get(
      `/Representatives/${id}/document/${fileId}`,
      {
        responseType: "arraybuffer",
      }
    );
    return response;
  },
  create: async function (representatives: FormData) {
    const response = await httpClient.post(
      "/Representatives",
      representatives,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },
  edit: async function (id: string, representatives: any) {
    const response = await httpClient.put(
      `/Representatives/${id}`,
      representatives
    );
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Representatives/${id}`);
    return response;
  },
  block: async function (id: string) {
    const response = await httpClient.put(`/Representatives/${id}/lock`);
    return response;
  },

  unblock: async function (id: string) {
    const response = await httpClient.put(`/Representatives/${id}/unlock`);
    return response;
  },

  approve: async function (id: string) {
    const response = await httpClient.put(`/Representatives/${id}/Approve`);
    return response;
  },
  reject: async function (id: string) {
    const response = await httpClient.put(`/Representatives/${id}/Reject`);
    return response;
  },
};
