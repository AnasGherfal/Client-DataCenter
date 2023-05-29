import httpClient from ".";
import type { Invoice } from "../Modules/Invoices/InvoicesRequestModule";

export const InvoiceApi = {
  get: async function () {
    const response = await httpClient.get(`/Invoices`);
    return response;
  },
  create: async function (invoice: Invoice) {
    const response = await httpClient.post(`/Invoices`, invoice);
    return response;
  },
};
