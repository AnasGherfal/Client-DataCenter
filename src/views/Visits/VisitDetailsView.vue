<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import VisitDetails from "./VisitDetails.vue";
import router from "@/router";
// import type { Visit } from '@/Modules/VisitModule/VisitModule'
import axios from "axios";
import { useRoute } from "vue-router";
import { visitApi } from "@/api/visits";
import type { VisitReq } from "@/Modules/VisitModule/VisitRequestModule";
import { representativesApi } from "@/api/representatives";

const store = useVistisStore();
const route = useRoute();
const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});

const visits = reactive({
  expectedStartTime: "",
  expectedEndTime: "",
  startTime: "",
  endTime: "",
  customerName: "",
  id: 0,
  visitTypeId: "",
  notes: "",
  timeShift: "",
  totalMin: "",
  price: 0,
  invoiceId: 0,
  representatives: [],
  companions: [  {
      firstName: "",
      lastName: "",
      identityNo: "",
      identityType: 0,
      jobTitle: ""
    }],
});
const rep = ref([]);


onMounted(async () => {
  getRepresentativeData();
  store.loading = true;
  visitApi
    .getById(userId.value)
    .then((response) => {
      // visits.startTime = response.data.startTime;
      // visits.endTime = response.data.endTime;
      // visits.customerName = response.data.customerName;
      // visits.representatives = response.data.representatives;
      // visits.id = response.data.id;
      const filteredVisits = response.data
      console.log(filteredVisits)
      

      
        Object.assign(visits, filteredVisits);
      
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.loading = false;
    });
});
async function getRepresentativeData() {
    try {
      const response = await representativesApi.get();
      rep.value = response.data.content;

    } catch (error) {
      console.log(error);
    }
  }

let today = new Date();
let month = today.getMonth;
let year = today.getFullYear;
let hours = today.getHours();

const minDate = ref(new Date());

const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {};

const toast = useToast();

// const v$ = useVuelidate(rules, visit);

// const submitForm = async () => {
//     const result = await v$.value.$validate();

//     if (result) {
//         toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
//     }

// }

</script>

<template>
  <VisitDetails :visit="visits" :key="visits.id"  ></VisitDetails>
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
