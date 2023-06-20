<script lang="ts" setup>
import { useInvoicesStore } from "@/stores/invoices";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { invoiceApi } from "@/api/invoice";
import InvoiceDetails from "./InvoiceDetails.vue";
const invoicesStore = useInvoicesStore();

const invoices = reactive({
  id: 0,
  status: 0,
  date: "",
  description: "",
  invoiceNo: "",
  startDate: "",
  endDate: "",
  isPaid: false,
  subscriptionId: 0,
  visits: [
    {
      startTime: "",
      endTime: "",
      customerName: "",
      id: 0,
      visitType: "",
      notes: "",
      timeShift: "",
      totalMin: "",
      price: 0,
      invoiceId: 0,
      representives: [],
      companions: [
        {
          firstName: "string",
          lastName: "string",
          identityNo: "string",
          identityType: 0,
          jobTitle: "string",
        },
      ],
    },
  ],
});
const route = useRoute();
// for getting the data from the route
const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null;
  }
});

onMounted(async () => {
  invoicesStore.loading = true;
  invoiceApi
    .get()
    .then((response) => {
      const filteredInvoices = response.data.content.filter(
        (visit: { id: String }) => visit.id == userId.value
      );
      if (filteredInvoices.length > 0) {
        Object.assign(invoices, filteredInvoices[0]);
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      invoicesStore.loading = false;
    });
});
</script>

<template>
  <InvoiceDetails :key="invoices.id" :invoices="invoices"></InvoiceDetails>
</template>

<style></style>
