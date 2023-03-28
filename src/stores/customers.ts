import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useCustomersStore = defineStore('customer', () => {

  const customers = ref<any[]>([]);

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Customers")
      .then(function (response) {
        customers.value = response.data.content

        console.log(customers)
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  


  return {  customers }

})
