import { ref, computed, reactive, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { InvoiceApi } from "@/api/invoice";

export const useInvoicesStore = defineStore("visit", () => {
  const Invoices = ref();

  onMounted(async () => {
    await getdata();
  });
  function getdata() {
    InvoiceApi
      .get()
      .then(function (response) {
        Invoices.value = response.data.content;
        console.log(Invoices);

      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }

  return { Invoices, getdata };
});
