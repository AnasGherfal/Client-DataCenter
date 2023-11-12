<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useVistisStore } from "@/stores/visits";
import VisitDetails from "./VisitDetails.vue";
import { useRoute } from "vue-router";
import { visitApi } from "@/api/visits";
import { VisitModel } from "../../Modules/VisitModule/VisitByIdModel";

const store = useVistisStore();
const route = useRoute();
const visitId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});

const visit = ref<VisitModel>();

onMounted(async () => {
  store.loading = true;
  visitApi
    .getById(visitId.value)
    .then((response) => {
      visit.value = response.data.content;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.loading = false;
    });
});
</script>

<template>
  <div
    v-if="store.loading"
    class="border-round border-1 surface-border p-4 surface-card"
  >
    <div class="grid p-fluid">
      <div v-for="n in 9" class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <Skeleton width="100%" height="2rem"></Skeleton>
        </span>
      </div>
    </div>

    <Skeleton width="100%" height="100px"></Skeleton>
    <div class="flex justify-content-between mt-3">
      <Skeleton width="100%" height="2rem"></Skeleton>
    </div>
  </div>
  <div v-if="!visit">
  </div>
  <VisitDetails v-else :visit="visit"></VisitDetails>
</template>
<style>
.p-button-icon {
  padding-left: 0;
}

.p-datepicker.p-datepicker-timeonly .p-timepicker {
  border-top: 0 none;
  direction: ltr;
}
</style>
