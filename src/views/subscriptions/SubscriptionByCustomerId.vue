<script setup lang="ts">
import {  ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";
import type { SubscriptionRespons } from "@/Modules/SubscriptionModule/SubscriptionsResponseModule";
import { useRoute } from "vue-router";

//

const subDeta = ref<SubscriptionRespons[]>([]);
const props = defineProps<{
  subsId: any;
}>();
const route = useRoute();
console.log(props.subsId);


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

const getDaysRemainingData = (endDate: Date) => {
  const now = moment();
  const end = moment(endDate);
  const daysRemaining = end.diff(now, "days");

  if (daysRemaining <= 0) {
    return { label: "منتهي", color: "red" };
  } else if (daysRemaining <= 30) {
    return { label: "قريباً من الانتهاء", color: "orange" };
  } else {
    return { label: "صالح", color: "green" };
  }
};
</script>

<template>
  <DataTable
    v-if="props.subsId"
    ref="dt"
    :value="props.subsId"
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
  <template #empty>
            <div
              class="no-data-message"
              style="
                height: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <p style="font-size: 18px; font-weight: bold; color: #888">
                لا يوجد بيانات
              </p>
            </div>
          </template>
    <Column
      field="customerName"
      header="اسم العميل"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>

    <Column field="daysRemaining" header="الصلاحية" style="min-width: 4rem">
      <template #body="{ data }">
        <span :style="{ color: getDaysRemainingData(data.endDate).color }">
          {{ getDaysRemainingData(data.endDate).label }}
        </span>
      </template>
    </Column>

    <Column
            field="status"
            header="  الحاله "
            filterField="status"
            style="width: 6rem"
            :showFilterMenu="false"
            :filterMenuStyle="{ width: '12rem' }"
          >
            <template #body="{ data }">
              <Tag
                :value="status(data.status)"
                :severity="getSeverity(data.status)"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Dropdown
                v-model="filterModel.value"
                @change="filterCallback()"
                :options="['warning', '']"
                placeholder="Select One"
                class="p-column-filter"
                style="min-width: 12rem"
                :showClear="true"
              >
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="slotProps.option" />
                </template>
              </Dropdown>
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
      header="تاريخ البداية "
      dataType="date"
      style="min-width: 10rem"
    >
      <template #body="{ data }">
        {{ formatDate(data.startDate) }}
      </template>
    </Column>

    <Column
      field="endDate"
      header="تاريخ النهاية "
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
