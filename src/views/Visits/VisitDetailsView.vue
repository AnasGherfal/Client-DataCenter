<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from "@/stores/customers";
import VisitDetails from "./VisitDetails.vue";
import router from "@/router";
// import type { Visit } from '@/Modules/VisitModule/VisitModule'
import axios from "axios";
import { useRoute } from "vue-router";
import { visitApi } from "@/api/visits";
import type { Visit } from "@/Modules/VisitModule/VisitRequestModule";

const store = useCustomersStore();
const id = defineProps<{ id: string }>();
const getVisits = ref({});
const route = useRoute();

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});

const visits: Visit = reactive({
  startTime: "",
  endTime: "",
  customerName: "",
  visitType: "",
  notes: "",
  timeShift: "",
  totalMin: "",
  price: 0,
  invoiceId: 0,
  representives: [],
  companions:[],
});

const compList = reactive([{}]);

onMounted(async () => {
  visitApi
    .get()
    .then((response) => {
        getVisits.id = response.data.content.filter(
        (visit: { id: String }) => visits.id == id.id
      )[0];
      console.log(visits);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {});
});

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

function backButton() {
  router.go(-1);
}
</script>

<template>
  <VisitDetails :visits="visits" :key="visits.id"></VisitDetails>
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
