import { ref, computed, reactive, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { visitApi } from "@/api/visits";

export const useVistisStore = defineStore("visit", () => {
  const visits = ref();

  onMounted(async () => {
    await getdata();
  });
  function getdata() {
    visitApi
      .get()
      .then(function (response) {
        visits.value = response.data.content;

      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }

  return { visits, getdata };
});
