import type { Customer } from "@/Models/CustomerModel/Customers";
import httpClient from ".";

export const customers = {
    create: async function (customer: Customer) {
        const response = await httpClient.post(`/Customers`, customer);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/customers/${id}`);
        return response;
    },
    edit: async function (id: number,customer: Customer) {
        const response = await httpClient.put(`/customers/${id}`, customer);
        return response;
    },
};
