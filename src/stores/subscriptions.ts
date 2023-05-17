import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { subscriptionApi } from "@/api/subscriptions";

export const useSubscriptionsStore = defineStore("Subscription", () => {
  const subscriptions = ref<any[]>([]);
  const loading = ref(true);

  onMounted(async () => {
    getSub();
  });

  function getSub() {
    subscriptionApi
      .get()
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
