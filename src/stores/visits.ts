import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { visitApi } from "@/api/visits";
import { representativesApi } from "@/api/representatives";

export const useVistisStore = defineStore("visit", () => {
  const visits = ref();
  const visitReasons = ref();
  const visitTypeString = ref()
  const representatives = ref([{}]);
  const loading = ref(true);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);

  onMounted(async () => {
    await getVisits(); // Add await here
    await getRepresentativeData(); // Add await here
    getTypes();
  });

  

  async function getVisits() {
    await visitApi
      .getPages(pageNumber.value, pageSize.value)
      .then(function (response) {
        visits.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function getRepresentativeData() {
    try {
      const response = await representativesApi.get();
      representatives.value = response.data.content;

    } catch (error) {
      console.log(error);
    }
  }

  async function getTypes() {
    await visitApi
      .getTypes()
      .then(function (response) {
        visitReasons.value = response.data.content;

      })
      .catch(function (error) {
        console.log(error);
      });
    }

  return {
    visits,
    getVisits,
    getRepresentativeData,
    representatives,
    loading,
    totalPages,
    pageNumber,
    currentPage,
    pageSize,
    visitReasons
  };
});
