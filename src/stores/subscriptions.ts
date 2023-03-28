import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useSubscriptionsStore = defineStore('customer', () => {

  const subscriptions = ref<any[]>([]);

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/")
      .then(function (response) {
        subscriptions.value = response.data.content

        console.log(subscriptions)
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  


  return {  subscriptions }

})
