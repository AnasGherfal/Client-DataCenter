import type { InvoiceResponde } from "../Modules/Invoices/InvoicesRespondeModule";

import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const invoiceApi = {
  get: async function (
    pageNumber: number,
    pageSize: number,
    name: string,
    startDate: any,
    endDate: any
  ) {
    const response = await httpClient.get(`/Invoices`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        CustomerName: name,
        StartDate: startDate,
        EndDate: endDate,
      },
    });

    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Invoices/${id}`);
    return response;
  },
  create: async function (invoice: InvoiceResponde) {
    const response = await httpClient.post(`/Invoices`, invoice);
    return response;
  },
  paid: async function (
    id: string,
    payload: {
      id: string;
      adminPassword: string;
    }
  ) {
    const response = await httpClient.put(`/Invoices/${id}/paid`, payload);
    return response;
  },
};
