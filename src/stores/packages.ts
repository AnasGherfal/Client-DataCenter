import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { serviceApi } from "@/api/service";

export const usePackagesStore = defineStore("package", () => {
  const Services = ref();
  const packagesList = ref();

  onMounted(async () => {
    getService();
  });

  function getService() {
    serviceApi
      .get()
      .then((response) => {
        packagesList.value = response.data.content;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return { Services };
});
