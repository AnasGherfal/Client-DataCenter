import { ref, computed, reactive, onMounted, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"



export const useCustomersStore = defineStore('customer', () => {

  const customers = ref();
  const loading = ref(true);
  const data = ref(null);

  onMounted(async () => {
  getCustomers();
  })
  
function getCustomers(){
   axios.get("https://localhost:7003/api/Customers")
  .then(function (response) {
    customers.value = response.data.content
    loading.value=false;

  })
  .catch(function (error) {
    console.log(error)
  })
  
 }
  return {  customers,  getCustomers, loading, data }

})
