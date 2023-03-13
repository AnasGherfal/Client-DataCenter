import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useCustomersStore = defineStore('customer', () => {

  const customers = ref([]);
  onMounted(async () => {
    await axios.get("http://localhost:3000/users")
      .then(function (response) {
        customers.value = response.data;
        console.log(customers)
      })
      .catch(function (error) {
        console.log(error)
      })

  })


  return { users: customers }

})
