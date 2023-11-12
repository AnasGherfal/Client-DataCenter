import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const audit = {
  get: async function (pageNumber: number, pageSize: number) {
    const response = await httpClient.get(`/Audits`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });
    return response;
  },
  getById: async function (id: any) {
    const response = await httpClient.get(`/Audits/${id}`);
    return response;
  },
};
