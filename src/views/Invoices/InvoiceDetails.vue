<script setup lang="ts">
import BackButton from "@/components/BackButton.vue";
import { useInvoicesStore } from "@/stores/invoices";
import moment from "moment";
import { ref } from "vue";

const props = defineProps<{ invoices: any }>();
const invoicesStore = useInvoicesStore();
const loading = ref(false);


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
              <Skeleton
                :loading="loading"
                width="100%"
                height="2rem"
              ></Skeleton>
            </div>
          </div>
        </div>
      <div v-else
        class="flex justify-content-between flex-wrap card-container"
      >
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
              {{ getPaymentStatus(invoices.id) }}
            </p>
          </div>
        </div>
        <div class="align-items-center justify-content-center border-round m-3">
          <p style="font-size: medium">تاريخ الانشاء : {{ convertToDate(invoices.startDate) }}</p>
          <p style="font-size: medium">تاريخ الاستحقاق : {{ convertToDate(invoices.endDate) }}</p>
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


      <DataTable
      v-else
        :value="invoices.visits"
        style="text-align: right"
        stripedRows
        tableStyle="min-width: 50rem"
      >
        <Column
          style="text-align: right"
          field="totalMin"
          header="اجمالي الوقت"
        ></Column>
        <Column
          style="text-align: right"
          field="price"
          header="السعر"
        ></Column>
        <Column
          style="text-align: right"
          field="notes"
          header="ملحوظات"
        ></Column>
      </DataTable>
    </template>
  </Card>
</template>
