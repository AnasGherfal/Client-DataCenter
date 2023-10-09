import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const timeShiftsApi = {
  get: async function () {
    const response = await httpClient.get("/TimeShifts");
    return response;
  },
  getById: async function (id: any) {
    const response = await httpClient.get(`/TimeShifts/${id}`);
    return response;
  },
  create: async function (timeShift: any) {
    const response = await httpClient.post("/TimeShifts", timeShift);
    return response;
  },
  edit: async function (id: any, timeShift: any) {
    const response = await httpClient.put(`/TimeShifts/${id}`, timeShift);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/TimeShifts/${id}`);
    return response;
  },
};
