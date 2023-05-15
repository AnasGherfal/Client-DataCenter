import { ref, computed, reactive, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import moment from "moment";

export const useSubscriptionsStore = defineStore("Subscription", () => {
  const subscriptions = ref<any[]>([]);
  const loading = ref(true);

  onMounted(async () => {
    await axios
      .get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
      .then(function (response) {
        subscriptions.value = response.data.content;
        console.log(subscriptions);
        loading.value = false;
      })
      .catch(function (error) {
        console.log(error);
        loading.value = false;
      });
  });

  function getSub() {
    axios
      .get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
      .then(function (response) {
        subscriptions.value = response.data.content;

        console.log(subscriptions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return { subscriptions, getSub, loading };
});
