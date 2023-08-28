import { httpClient } from "./index";
import type { InvoiceResponde } from "../Modules/Invoices/InvoicesRespondeModule";

export const invoiceApi = {
  get: async function (
    pageNumber: number,
    pageSize: number,
    name: string,
    startDate: any,
    endDate: any
  ) {
    const response = await httpClient.get(
      `/Invoices?CustomerName=${name}&StartDate=${startDate}&EndDate=${endDate}&PageSize=${pageSize}&PageNumber=${pageNumber}`
    );

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
};
