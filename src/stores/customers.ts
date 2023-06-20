import { ref, computed, reactive, onMounted, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { customersApi } from "@/api/customers";

export const useCustomersStore = defineStore("customer", () => {
  const customers = ref();
  const loading = ref(true);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);

  onMounted(async () => {
    getCustomers();
  });
  async function getCustomers() {
    await customersApi
      .get(pageNumber.value, pageSize.value)
      .then(function (response) {
        customers.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  return {
    customers,
    getCustomers,
    loading,
    totalPages,
    pageNumber,
    currentPage,
    pageSize,
  };
});
