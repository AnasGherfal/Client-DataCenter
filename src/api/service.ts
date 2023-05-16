import type { Service } from "@/Models/ServicesModel/ServicesModel";
import httpClient from ".";

export const service = {
    create: async function (service: Service) {
        const response = await httpClient.post(`/Service`, service);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/Service?id=${id}`);
        return response;
    },
    edit: async function (id: number,service: Service) {
        const response = await httpClient.put(`/Service?id=${id}`, service);
        return response;
    },
};