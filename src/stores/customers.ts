import { ref, computed, reactive, onMounted, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { customersApi } from "@/api/customers";

export const useCustomersStore = defineStore("customer", () => {
  const customers = ref([]);
  const loading = ref(true);
  const totalPages = ref(1);
  const pageNumber = ref(1);

});
