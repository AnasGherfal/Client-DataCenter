<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";
import { subscriptionApi } from "@/api/subscriptions";
import type { SubscriptionRespons } from "@/Modules/SubscriptionModule/SubscriptionsResponseModule";
import { useRoute } from "vue-router";

//

const subDeta = ref<SubscriptionRespons[]>([]);
const props = defineProps<{
  subsId: any;
}>();
const route = useRoute();
console.log(props.subsId)
onMounted(async () => {
  subscriptionApi
    .getById(props.subsId)
    .then(function (response) {
      console.log(response.data);
      subDeta.value = [response.data]; // Wrap the response data in an array
    })
    .catch(function (error) {
      console.log(error);
    });
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([{ field: "serviceName", header: "الباقه" }]);

const selectedColumns = ref(columns.value);

const formatDate = (value: Date) => {
  return moment(value).format("yy/M/D  hh:mm a");
};

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case " مفعل":
      return "success";
    case " غير مفعل":
      return "danger";
    case " مقفل":
      return "danger";
  }
};
const status = (value: number) => {
  if (value === 1) {
    return " مفعل";
  } else if (value === 2) {
    return " غير مفعل";
  } else if (value === 5) return " مقفل";
};

const trans = (value: string) => {
  if (value == "1") return " مفعل";
  else if (value == "2") return " غير مفعل";
  else if (value == "5") return " مقفل";
};

</script>

<template>{{ subDeta }}
  <DataTable
    v-if="subDeta"
    ref="dt"
    :value="subDeta"
    dataKey="id"
    :paginator="true"
    :rows="5"
    v-model:filters="filters"
    :globalFilterFields="['serviceName', 'customerName']"
    paginatorTemplate=""
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل"
    responsiveLayout="scroll"
  >
    <Column
      field="customerName"
      header="اسم العميل"
      style="min-width: 8rem"
      class="font-bold"
    ></Column>

    <Column
      field="status"
      header="الحالة"
      dataType="date"
      style="min-width:6rem"
    >
      <template #body="{ data }">
        {{ status(data.status) }}
      </template>
    </Column>

    <Column
      v-for="(col, index) of selectedColumns"
      :field="col.field"
      :header="col.header"
      :key="col.field + '_' + index"
      style="min-width: 4rem"
    ></Column>

    <Column
      field="startDate"
      header="تاريخ بداية الاشتراك"
      dataType="date"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        {{ formatDate(data.startDate) }}
      </template>
    </Column>

    <Column
      field="endDate"
      header="تاريخ نهاية الاشتراك"
      dataType="date"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        {{ formatDate(data.endDate) }}
      </template>
    </Column>

    <Column style="min-width: 3rem">
      <template #body="slotProps">
        <RouterLink
          :key="slotProps.data.id"
          :to="
            '/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id
          "
          style="text-decoration: none"
        >
          <Button
            icon="fa-solid fa-circle-info"
            severity="info"
            text
            rounded
            v-tooltip="{ value: 'التفاصيل', fitContent: true }"
          />
        </RouterLink>
      </template>
    </Column>
  </DataTable>
</template>

<style></style>
