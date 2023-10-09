<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import moment from "moment";
import type { VisitHours } from "@/Modules/TimeShiftsModule/TimeShiftsModule";
import DeleteTimeShifts from "./DeleteTimeShifts.vue";
import AddTimeShifts from "./AddTimeShiftsView.vue";
import { timeShiftsApi } from "@/api/timeShifts";
import { days } from "@/tools/days";

const timeShifts = ref([]);
const selectedHours = ref();
const loading = ref(false);

const formChanged = ref(false);

const toast = useToast();

onMounted(async () => {
  getTimeShifts();
});

const getTimeShifts = async () => {
  loading.value = true;

  timeShiftsApi
    .get()
    .then((response) => {
      timeShifts.value = response.data.content.map((item:any) => {
        return {
          ...item,
          day: days.find((day) => day.value === item.day)?.name,
          date: item.date ? moment(item.date).format("YYYY-MM-DD") : "-",
        }
      });
    })
    .catch(function (error) {
      toast.add({
        severity: "error",
        summary: "حدث خطأ",
        detail: error.response.data?.msg || "لم يتم الحصول على الساعات",
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
      selectedHours.value = null;
    });
};

let selected = 1;
const getIndex = (index: any) => {
  selected = index;
};
</script>

<template>
  <div>
    <AddTimeShifts @getTimeShifts="getTimeShifts"> </AddTimeShifts>

      <div>
        <div
          v-if="loading"
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
          :value="timeShifts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :globalFilterFields="[
            'day',
            'startTime',
            'End Time',
            'date',
            'Price For First Hour',
            'Price For Remaining Hours',
          ]"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="  عرض {first} الى {last} من {totalRecords} عميل"
          paginatorTemplate="  "
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

          <!-- <Column field="id" header="ID" class="font-bold"></Column> -->

          <Column
            v-for="(head, index) in [
              {key: 'day', label: 'اليوم'},
              {key: 'startTime', label: 'تاريخ البداية'},
              {key: 'endTime', label: 'تاريخ النهاية'},
              {key: 'date', label: 'التاريخ'},
              {key: 'priceForFirstHour', label: 'السعر مقابل الساعة الاولى'},
              {key: 'priceForRemainingHours', label: 'السعر مقابل باقي الساعات'},
            ]"
            :key="index"
            :field="head.key"
            :header="head.label"
            style="min-width: 6rem"
            class="font-bold"
            frozen
          ></Column>

          <Toast position="bottom-left" />
        </DataTable>
      </div>
  </div>
</template>
