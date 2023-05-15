import httpClient from ".";

export const customersService = {
    create: async function (customer: any) {
        const response = await httpClient.post('/customers', customer);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/customers/${id}`);
        return response;
    }
};
