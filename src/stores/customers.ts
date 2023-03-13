import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useCustomersStore = defineStore('customer', () => {

  const Customers = ref([]);
  
  onMounted(async () => {
    await axios.get("http://localhost:3000/users")
      .then(function (response) {
        Customers.value = response.data;
        console.log(Customers.value[0])
      })
      .catch(function (error) {
        console.log(error)
      })

  })


  return { users: Customers }

})
