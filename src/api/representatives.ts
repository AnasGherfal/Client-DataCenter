import type { Representatives } from "@/Models/CustomerModel/RepresentativesModel/Representatives";
import httpClient from ".";

export const representativesApi = {
    get: async function () {
        const response = await httpClient.get(`/Representives`);
        return response;
    },
    create: async function (representives: Representatives) {
        const response = await httpClient.post('/Representives', representives);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/Representives/${id}`);
        return response;
    },
    
};
