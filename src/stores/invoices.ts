import { ref, computed, reactive, onMounted } from "vue";
import { defineStore } from "pinia";
import { invoiceApi } from "@/api/invoice";
import { useRoute } from "vue-router";

export const useInvoicesStore = defineStore("visit", () => {
  const invoices = ref([]);
  const visits = ref()
  const loading = ref(true);
  onMounted(async () => {
    getInvoices();
  });
  const route = useRoute();

  const userId = computed(() => {
    if (route && route.params && route.params.id) {
      return route.params.id;
    } else {
      return null;
    }
  });
  function getInvoices() {
    loading.value = true;
    invoiceApi
      .get()
      .then(function (response) {
        invoices.value = response.data.content;
        visits.value = response.data.content;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        loading.value = false;
      });
  }

  return { invoices, getInvoices, loading, visits };
});
