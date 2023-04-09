import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useVistisStore = defineStore('visit', () => {

  const visits = ref();

  onMounted(async () => {
    await getdata();

  })
function getdata(){
   axios.get("http://localhost:3000/visits")
  .then(function (response) {
    visits.value = response.data

    console.log(visits.value)
  })
  .catch(function (error) {
    console.log(error)
  })
  
 }

 
  


  return {  visits, getdata }

})
