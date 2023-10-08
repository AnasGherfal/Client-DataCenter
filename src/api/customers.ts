import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import { httpClient } from "./index";
export const customersApi = {
  get: async function (pageNumber: number, pageSize: number, name: string) {
    const response = await httpClient.get(
      `/Customers?Search=${name}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Customers/${id}`);
    return response;
  },
  getFile: async function (id: string) {
    const response = await httpClient.get(`/Customers/${id}/Download`, { responseType: 'arraybuffer' });
    return response;
  },

  create: async function (customer: any) {
    const response = await httpClient.post(`/Customers`, customer);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/Customers/${id}`);
    return response;
  },
  edit: async function (id: string, customer: any) {
    const response = await httpClient.put(`/customers/${id}`, customer);
    return response;
  },
};
