import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { subscriptionApi } from "@/api/subscriptions";

export const useSubscriptionsStore = defineStore("Subscription", () => {
  const subscriptions = ref<any[]>([]);
  const loading = ref(true);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);
  const status = ref<number>(0);
  // onMounted(async () => {
  //   getSubs();
  // });


  function getSubs() {
    console.log(status.value);
    // if (status.value === undefined || status.value === null) {
    //   status.value = 0;
    // }
    subscriptionApi
      .getPages(pageNumber.value, pageSize.value)
      .then(function (response) {
        subscriptions.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  }



  return {
    subscriptions,
    getSubs,
    loading,
    totalPages,
    pageNumber,
    currentPage,
    pageSize,
    
    
  };
});
