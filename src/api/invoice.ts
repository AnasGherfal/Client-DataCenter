import httpClient from ".";
import type { InvoiceResponde } from "../Modules/Invoices/InvoicesRespondeModule";

export const invoiceApi = {
  get: async function () {
    const response = await httpClient.get(`/Invoices`);
    return response;
  },
  create: async function (invoice: InvoiceResponde) {
    const response = await httpClient.post(`/Invoices`, invoice);
    return response;
  },
};
