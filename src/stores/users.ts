import { ref, computed, reactive, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

export const useUsersStore = defineStore('user', () => {

  const users = ref([]);
  const userActiv= ref([]);
  onMounted(async () =>{
    await axios.get("http://localhost:3000/users")
   .then(function(response) {
       users.value = response.data;
   console.log(users)
})
.catch(function(error){
   console.log(error)
 })

})


return{ users}

})
