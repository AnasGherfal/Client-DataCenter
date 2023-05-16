import httpClient from ".";

export const representativesApi = {
    create: async function (representives: any) {
        const response = await httpClient.post('/Representives', representives);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/Representives/${id}`);
        return response;
    },
    
};
