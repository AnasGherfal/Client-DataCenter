<script setup lang="ts">
import BackButton from "@/components/BackButton.vue";
import { useInvoicesStore } from "@/stores/invoices";
import moment from "moment";
import { computed, onMounted, reactive, ref } from "vue";
import { invoiceApi } from "@/api/invoice";
import { useRoute } from "vue-router";
import { formatTotalMin } from "@/tools/formatTime";
const invoicesStore = useInvoicesStore();
const loading = ref(false);
const route = useRoute();

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return String(route.params.id); // Convert the ID to a number
  } else {
    return ""; // or return a default value if id is not available, such as -1
  }
});

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

onMounted(() => {
  invoiceApi.getById(userId.value).then((response) => {
    console.log(response);
    invoices.id = response.data.id;
    invoices.status = response.data.status;
    invoices.date = response.data.date;
    invoices.description = response.data.description;
    invoices.invoiceNo = response.data.invoiceNo;
    invoices.startDate = response.data.startDate;
    invoices.endDate = response.data.endDate;
    invoices.isPaid = response.data.isPaid;
    invoices.subscriptionId = response.data.subscriptionId;
    invoices.visits = response.data.visits;
  });
});

const getPaymentStatus = (isPaid: boolean) => {
  return isPaid ? "مدفوعه" : "غير مدفوعه";
};
function convertToDate(dateString: string): string {
  const date = moment(dateString).format("YYYY-MM-DD HH:mm"); // Convert to string format
  return date;
}
</script>

<template>
  <Card>
    <template #title>
      <BackButton style="float: left"></BackButton>

      <div v-if="invoicesStore.loading">
        <div class="grid p-fluid">
          <div class="field col-12 md:col-6 lg:col-4">
            <span class="p-float-label">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </span>
          </div>
          <div class="field col-12 md:col-6 lg:col-4">
            <span class="p-float-label">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </span>
          </div>
          <div class="field col-12 md:col-6 lg:col-4">
            <span class="p-float-label">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </span>
          </div>
          <div class="field col-12 md:col-6 lg:col-4">
            <span class="p-float-label">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </span>
          </div>
          <div class="field col-12 md:col-6 lg:col-4">
            <span class="p-float-label">
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </span>
          </div>
          <div class="field col-12 md:col-6 lg:col-4">
            <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-content-between flex-wrap card-container">
        <div class="align-items-center justify-content-center border-round m-3">
          <h2 class="m-0">فاتورة #{{ invoices.id }}</h2>
          <h5 class="text-600 m-0">مركز ادارة الخدمات والبيانات</h5>
          <div
            class="border-green-500 border-round-md text-center justify-content-center"
          >
            <p
              :style="{
                color: invoices.isPaid ? 'green' : 'red',
                fontSize: ' 20px',
              }"
              class="text-md"
            >
              {{ getPaymentStatus(invoices.isPaid) }}
            </p>
          </div>
        </div>
        <div class="align-items-center justify-content-center border-round m-3">
          <p style="font-size: medium">
            تاريخ الانشاء : {{ convertToDate(invoices.startDate) }}
          </p>
          <p style="font-size: medium">
            تاريخ الاستحقاق : {{ convertToDate(invoices.endDate) }}
          </p>
        </div>
      </div>
    </template>
    <template #content>
      <Divider></Divider>
      <h1 class="text-center">الزيارات</h1>
      <!-- Add the headline here -->
      <div
        v-if="invoicesStore.loading"
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

      <DataTable v-else :value="invoices.visits">
        <Column style="min-width: 2rem" field="totalMin" header=" الوقت">
          <template #body="{ data }">
            {{ formatTotalMin(data.totalMin) }}
          </template></Column
        >
        <Column
          style="text-align: right; min-width: 2rem"
          field="price"
          header="السعر"
          tableStyle="min-width: 2rem"
        ></Column>
        <Column style="min-width: 2rem" field="notes" header="ملحوظات"></Column>
      </DataTable>
    </template>
  </Card>
</template>
