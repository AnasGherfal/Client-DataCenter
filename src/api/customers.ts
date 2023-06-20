import type { Customer } from "../Modules/CustomerModule/CustomersModule";
import httpClient from ".";

export const customersApi = {
  get: async function (pageNumber: number, pageSize: number){
    const response = await httpClient.get(`/Customers?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    return response;
  },
  getById: async function (id: number) {
    const response = await httpClient.get(`/Customers/${id}`);
    return response;
  },

  create: async function (customer: any) {
    const response = await httpClient.post(`/Customers`, customer);
    return response;
  },
  remove: async function (id: number) {
    const response = await httpClient.delete(`/Customers/${id}`);
    return response;
  },
  edit: async function (id: number, customer: Customer) {
    const response = await httpClient.put(`/customers/${id}`, customer);
    return response;
  },
};
