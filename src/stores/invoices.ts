import { ref, computed, reactive, onMounted } from "vue";
import { defineStore } from "pinia";
import { invoiceApi } from "@/api/invoice";
import { useRoute } from "vue-router";
import type { Nullable } from "primevue/ts-helpers";

export const useInvoicesStore = defineStore("visit", () => {
  const invoices = ref([]);
  const visits = ref();
  const loading = ref(false);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);
  const name = ref("");
  const startDate = ref("");
  const endDate = ref("");

  const route = useRoute();

  const userId = computed(() => {
    if (route && route.params && route.params.id) {
      return route.params.id;
    } else {
      return null;
    }
  });

  // async function searchByName(searchName: string) {
  //   invoice.name = searchName;
  //   await getInvoices(); // Await the getCustomers function to wait for the API call to complete
  // }
  onMounted(async () => {
    getInvoices();
  });
   function searchByDateAndName(
    searchName: string,
    serachStartDate: any,
    searchEndDate: any
  ) {
    name.value = searchName;
    startDate.value = serachStartDate;
    endDate.value = searchEndDate;
     getInvoices(); // Await the getCustomers function to wait for the API call to complete
  }

  function getInvoices() {
    loading.value = true;
    if (
      (startDate.value === undefined && endDate.value === undefined) ||
      (startDate.value === null && endDate.value == null)
    ) {
      startDate.value = "";
      endDate.value = "";
    }

    invoiceApi
      .get(
        pageNumber.value,
        pageSize.value,
        name.value,

      )
      .then(function (response) {
        invoices.value = response.data.content;
        visits.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        loading.value = false;
      });
  }

  return {
    invoices,

    name,
    startDate,
    endDate,
    getInvoices,
    loading,
    visits,
    totalPages,
    pageNumber,
    pageSize,
    currentPage,
    searchByDateAndName,
  };
});
