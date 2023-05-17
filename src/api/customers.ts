import type { Customer } from "@/Models/CustomerModel/Customers";
import httpClient from ".";

export const customersApi = {
    get: async function () {
        const response = await httpClient.get(`/Customers`);
        return response;
    },
    create: async function (customer: Customer) {
        const response = await httpClient.post(`/Customers`, customer);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/Customers/${id}`);
        return response;
    },
    edit: async function (id: number,customer: Customer) {
        const response = await httpClient.put(`/customers/${id}`, customer);
        return response;
    },
};
