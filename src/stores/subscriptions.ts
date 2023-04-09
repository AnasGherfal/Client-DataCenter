import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useSubscriptionsStore = defineStore('Subscription', () => {

  const subscriptions = ref<any[]>([]);

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
      .then(function (response) {
        subscriptions.value = response.data.content

        console.log(subscriptions)
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  
  function getSub(){
   
     axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
      .then(function (response) {
        subscriptions.value = response.data.content

        console.log(subscriptions)
      })
      .catch(function (error) {
        console.log(error)
      })
 
  }


  return {  subscriptions,getSub }

})
