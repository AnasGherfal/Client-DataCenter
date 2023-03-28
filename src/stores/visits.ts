import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useVistisStore = defineStore('customer', () => {

  const visits = ref<any[]>([]);

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/")
      .then(function (response) {
        visits.value = response.data.content

        console.log(visits)
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  


  return {  visits }

})
