import {httpClient} from "./index";

export const timeShiftsApi = {
  get: async function () {
    const response = await httpClient.get("/VisitTimeShift");
    return response;
  },
  create: async function (timeShift: any) {
    const response = await httpClient.post("/VisitTimeShift", timeShift);
    return response;
  },
  edit: async function (id: any, timeShift: any) {
    const response = await httpClient.put(`/VisitTimeShift/${id}`, timeShift);
    return response;
  },
  remove: async function (id: string) {
    const response = await httpClient.delete(`/VisitTimeShift/${id}`);
    return response;
  },
};
