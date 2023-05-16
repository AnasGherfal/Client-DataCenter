import httpClient from ".";

export const customersApi = {
    create: async function (customer: any) {
        const response = await httpClient.post('/Customers', customer);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/Customers/${id}`);
        return response;
    }
};
