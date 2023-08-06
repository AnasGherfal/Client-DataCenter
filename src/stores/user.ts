import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { user } from "@/api/user";

export const useUserStore = defineStore("user", () => {
  const userData = ref();
  const loading = ref(true);
  const data = ref(null);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);
  onMounted(async () => {
    getUsers();
  });

  function getUsers() {
    user
      .get(pageNumber.value, pageSize.value)
      .then(function (response) {
        userData.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
        loading.value = false;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return {
    userData,
    getUsers,
    loading,
    data,
    totalPages,
    pageNumber,
    currentPage,
    pageSize,
  };
});
