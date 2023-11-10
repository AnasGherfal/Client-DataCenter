import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const customersApi = {
  create: async function (customer: any) {
    const response = await httpClient.post(`/Customers`, customer, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  get: async function (pageNumber: number, pageSize: number, name: string) {
    const response = await httpClient.get(`/Customers`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        CustomerName: name,
      },
    });
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Customers/${id}`);
    return response;
  },
  edit: async function (id: string, customer: any) {
    const response = await httpClient.put(`/customers/${id}`, customer);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Customers/${id}`);
    return response;
  },
  getDocument: async function (id: string, fileId: string) {
    const response = await httpClient.get(
      `/Customers/${id}/document/${fileId}`,
      {
        responseType: "arraybuffer",
      }
    );
    return response;
  },
  editDocument: async function (id: string, fileId: string, data:any) {
    const response = await httpClient.put(
      `/Customers/${id}/document/${fileId}`,data
    );
    return response;
  },
  createDocument: async function (id: string, payload: FormData) {
    const response = await httpClient.post(
      `/Customers/${id}/document`,
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
    const response = await httpClient.put(`/Customers/${id}/lock`);
    return response;
  },

  unblock: async function (id: string) {
    const response = await httpClient.put(`/Customers/${id}/unlock`);
    return response;
  },
};
