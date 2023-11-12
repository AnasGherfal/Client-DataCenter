<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import moment from "moment";
import type { VisitHours } from "@/Modules/TimeShiftsModule/TimeShiftsModule";
import Delete from "@/components/DeleteButton.vue";
import AddTimeShifts from "./AddTimeShiftsView.vue";
import { timeShiftsApi } from "@/api/timeShifts";
import { days } from "@/tools/days";
import VueApexCharts from "vue3-apexcharts";

import TimeShiftsDetails from "./TimeShiftDetails.vue";
import { start } from "nprogress";

const timeShifts = ref([]);
const selectedHours = ref();
const loading = ref(false);

const formChanged = ref(false);

const startDate = ref()
const endDate = ref()


const toast = useToast();


const series = ref([

]);


const chartOptions = ref({
  chart: {
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      dataLabels: {
        hideOverflowingLabels: false,
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any, opts: any) {
      var label = opts.w.globals.labels[opts.dataPointIndex];
      var a = moment(val[0]);
      var b = moment(val[1]);
      var diff = b.diff(a, "hours");
      return label + ": " + diff + (diff > 1 ? " hours" : " hour");
    },
    style: {
      colors: ["#f3f4f5", "#fff"],
    },
  },
  xaxis: {
        show: true,

  },
  yaxis: {
    show: true,
  },
  grid: {
    row: {
      colors: ["#f3f4f5", "#fff"],
      opacity: 1,
    },
  },
});

// var chart = new ApexCharts(
//   document.querySelector("#chart"),
//   chartOptions
// );

onMounted(async () => {
  getTimeShifts();
});

const getTimeShifts = async () => {
  loading.value = true;

  timeShiftsApi
    .get()
    .then((response) => {

      // chart.updateSeries([{
      //   name:'aa',
      //   data: response.data.content

      // }])

      timeShifts.value = response.data.content.map((item: any) => {
        return {
          ...item,
          day: days.find((day) => day.value === item.day)?.name,
          date: item.date ? moment(item.date).format("YYYY-MM-DD") : "-",
  
        };
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

const deleteTimeShift = (id: string) => {
  loading.value = true;
  timeShiftsApi
    .remove(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data.msg,
        life: 3000,
      });
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.response.data.msg,
        life: 3000,
      });
    })
    .finally(() => {
      getTimeShifts();
      loading.value = false;
    });
};
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/SettingsView'">
    <AddTimeShifts @getTimeShifts="getTimeShifts"> </AddTimeShifts>
    {{ startDate }}
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
      <!-- <VueApexCharts
        width="100%"
        height="350"
        type="rangeBar"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts> -->

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
            { key: 'day', label: 'اليوم' },
            { key: 'startTime', label: 'وقت البداية' },
            { key: 'endTime', label: 'وقت النهاية' },
            { key: 'date', label: 'التاريخ' },
            { key: 'priceForFirstHour', label: 'السعر مقابل الساعة الاولى' },
            {
              key: 'priceForRemainingHours',
              label: 'السعر مقابل باقي الساعات',
            },
          ]"
          :key="index"
          :field="head.key"
          :header="head.label"
          style="min-width: 7rem; text-align: start"
          class="font-bold"
          frozen
        ></Column>
        <Column style="min-width: 11rem" header="  الاجراءات ">
          <template #body="slotProps">
            <Delete
              :name="slotProps.data.day"
              :id="slotProps.data.id"
              @submit="() => deleteTimeShift(slotProps.data.id)"
              type="TimeShifts"
            >
            </Delete>

            <RouterLink
              :to="'/SettingsView/timeShiftDetails/' + slotProps.data.id"
            >
              <Button
                v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                icon="fa-solid fa-circle-info"
                severity="info"
                text
                rounded
                aria-label="Cancel"
              />
            </RouterLink>
          </template>
        </Column>

        <Toast position="bottom-left" />
      </DataTable>
    </div>
  </div>
</template>
