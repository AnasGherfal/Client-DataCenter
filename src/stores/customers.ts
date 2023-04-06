import { ref, computed, reactive, onMounted, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"



export const useCustomersStore = defineStore('customer', () => {

  const customers = ref();

  onMounted(async () => {
    await getdata();

  })
function getdata(){
   axios.get("https://localhost:7003/api/Customers")
  .then(function (response) {
    customers.value = response.data.content

    console.log(customers)
  })
  .catch(function (error) {
    console.log(error)
  })
  
 }
  return {  customers, getdata }

})
