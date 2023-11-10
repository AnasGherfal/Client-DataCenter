<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import BackButton from "@/components/BackButton.vue";
import type Textarea from "primevue/textarea";
import ComapanionsDataTable from "./Companions/CompanionsDataTable.vue";
import { visitApi } from "@/api/visits";
import { formatTotalMin } from "@/tools/formatTime";

import { formatTime } from "@/tools/formatTime";
import "vue-select/dist/vue-select.css";

import { VisitModel } from "../../Modules/VisitModule/VisitByIdModel";
import moment from "moment";

const store = useVistisStore();
const props = defineProps<{ visit: VisitModel }>();
const editable = ref(true);
const loading = ref(true);
const visitReasons = ref<visitReason[]>([]);

type visitReason = {
  value: number;
  text: string;
};
// Array of identity type options

onMounted(async () => {});

const formattedStartTime = computed({
  get: () => formatTime(props.visit.startTime),
  set: (newValue) => {
    // If you want to update the startTime when the user selects a new value
    props.visit.startTime = newValue;
  },
});
const formattedEndTime = computed({
  get: () => formatTime(props.visit.endTime),
  set: (newValue) => {
    // If you want to update the startTime when the user selects a new value
    props.visit.endTime = newValue;
  },
});
</script>

<template>
  <div>
    <Card>
      <template #title>
        تفاصيل الزيارة
        <BackButton style="float: left" />
      </template>
      <template #content>
        <div v-if="store.loading">
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
        <div v-else>
          <div class="grid p-fluid my-5">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="startTime">تاريخ بداية الزيارة </label>
                <InputText
                  inputId="startTime"
                  :value=" visit.startTime ? formatTime(visit.startTime): 'الزيارة لم تبدأ'"
    
                  :disabled="editable"
                />
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="stopDate">تاريخ انتهاء الزيارة </label>
                <InputText
                  inputId="stopDate"
                  :value="visit.endTime ? formatTime(visit.endTime): 'الزيارة غير منتهية'"
                  :disabled="editable"

                />
              </span>
            </div>
          </div>
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="customerName">العميل</label>
                <InputText
                  v-model="visit.customer"
                  optionLabel="customerName"
                  :disabled="true"
                />
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="customerName">الاشتراك</label>
                <InputText
                  v-model="visit.service"
                  optionLabel="customerName"
                  :disabled="true"
                />
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="companionName"> مدة الزيارة </label>
                <InputText
                  id="companionName"
                  :value="
                    visit.totalTime ? formatTotalMin(visit.totalTime) : 'الزيارة غير منتهة'
                  "
                  :readonly="true"
                  :disabled="true"
                />
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="visitPrice"> السعر </label>
                <InputText
                  id="visitPrice"
                  :value="visit.visitPrice + ' دينار'"
                  :readonly="true"
                  :disabled="true"
                />
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label
                  style="color: black; top: -0.75rem; font-size: 12px"
                  for="visitType"
                  >سبب الزيارة
                </label>
                <Dropdown
                  id="visitType"
                  v-model="visit.visitType"
                  :options="store.visitReasons"
                  optionValue="id"
                  optionLabel="name"
                  :disabled="true"
                />
              </span>
            </div>

            <div class="field col-8 md:col-3 lg:col-4">
              <span class="">
                <label for="notes"> الملاحظات </label>
                <Textarea id="notes" v-model="visit.notes" :disabled="true" />
              </span>
            </div>
          </div>

          <span
            style="font-size: 20px; font-weight: bold; margin-right: 0.5rem"
            for="representives"
          >
            المخوليين:
          </span>
          <DataTable
            dataKey="identityNo"
            ref="dt"
            :value="visit.representatives"
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

            <Column field="firstName" header="الاسم الاول "></Column>
            <Column field="lastName" header="الاسم التاني "></Column>
            <Column field="identityType" header="نوع الاثبات"></Column>
            <Column field="identityNo" header="رقم الاثبات"></Column>
          </DataTable>

          <span
            style="
              top: -0.75rem;
              font-size: 20px;
              font-weight: bold;
              margin-right: 0.5rem;
            "
            for="representives"
          >
            المرافقين:
          </span>
          <div
            v-if="props.visit.companions.length == 0"
            style="font-style: italic; color: #999; margin-top: 0.5rem"
          >
            لايوجد مرافقين في هذه الزيارة
          </div>
          <div v-else>
            <ComapanionsDataTable
              :comp-list="visit.companions"
              :editable="editable"
            >
            </ComapanionsDataTable>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<style>
.representative-label {
  font-weight: bold;
}

.representative-value {
  font-weight: normal;
}
.vs__selected {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--vs-border-radius);
  color: var(--vs-selected-color);
  line-height: var(--vs-line-height);
  margin: 4px 2px 0;
  padding: 0 0.25em;
  z-index: 0;
}

.vs__dropdown-toggle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: flex;
  padding: 0 0 4px;
  background: none;
  border: 1.5px solid #eef1f4;
  border-radius: 0.5rem;
  white-space: normal;
  direction: rtl;
}
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__clear,
.vs--disabled .vs__search,
.vs--disabled .vs__selected,
.vs--disabled .vs__open-indicator {
  cursor: var(--vs-disabled-cursor);
  background-color: white;
}
.vs--disabled .vs__dropdown-toggle {
  direction: rtl;
  border-color: #e4e9ee;
}

.vs--disabled .vs__selected {
  color: #688aab;
}
</style>
