import { createApp, ref, computed, onMounted } from "vue";
import { createPinia } from "pinia";
import { defineStore } from "pinia";
import axios from "axios";

export const usePackagesStore = defineStore("package", () => {
  const Services = ref();
  const packagesList = ref();

  onMounted(async () => {
    getService();
  });

  function getService() {
    axios
      .get("https://localhost:7003/api/Service")
      .then((response) => {
        packagesList.value = response.data.content;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return { Services };
});
