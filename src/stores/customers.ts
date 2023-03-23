import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useCustomersStore = defineStore('customer', () => {

  const customers = ref([]);
  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Customers/")
      .then(function (response) {
        console.log(response)
        customers.value = response.data.content;
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  


  return {  customers }

})
