import httpClient from ".";

export const timeShiftsApi = {
    get: async function () {
        const response = await httpClient.get('/VisitTimeShift');
        return response;
    },
    create: async function (timeShift: any) {
        const response = await httpClient.post('/VisitTimeShift', timeShift);
        return response;
    },
    remove: async function (id: number) {
        const response = await httpClient.delete(`/VisitTimeShift/${id}`);
        return response;
    },
    
};
