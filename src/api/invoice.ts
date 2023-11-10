import type { InvoiceResponde } from "../Modules/Invoices/InvoicesRespondeModule";

import { useHttpClient } from "@/network/httpClient";

const httpClient = useHttpClient();

export const invoiceApi = {
  get: async function (
    pageNumber: number,
    pageSize: number,
    CustomerId: string
  ) {
    const response = await httpClient.get(`/Invoices`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        CustomerId: CustomerId,
      },
    });

    return response;
  },
  getById: async function (id: string) {
    const response = await httpClient.get(`/Invoices/${id}`);
    return response;
  },
  create: async function (invoice: FormData) {
    const response = await httpClient.post(`/Invoices`, invoice, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
