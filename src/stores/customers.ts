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
  const name = ref<string>("");

  onMounted(async () => {
    getCustomers();
  });
  async function searchByName(searchName: string) {
  
    name.value = searchName;
    await getCustomers(); // Await the getCustomers function to wait for the API call to complete
  }
  async function getCustomers() {
    if (name.value === undefined || name.value === null) {
      name.value = '';
    }
    await customersApi
      .get(pageNumber.value, pageSize.value, name.value)
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
    name,
    searchByName, // Expose the searchByName function

  };
});
