import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { user } from "@/api/user";

export const useUserStore = defineStore("user", () => {
  const userData = ref();
  const loading = ref(true);
  const data = ref(null);

  onMounted(async () => {
    getUser();
  });

  function getUser() {
    user
      .get()
      .then(function (response) {
        userData.value = response.data.content;
        loading.value = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return { userData, getUser, loading, data };
});
