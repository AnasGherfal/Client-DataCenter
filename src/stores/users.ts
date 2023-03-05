import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('counter', () => {

  const userInfo = ref(
    [
    {
    Username:'',




  }
])



  return {userInfo}
})
