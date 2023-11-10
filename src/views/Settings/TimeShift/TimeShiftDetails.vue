<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import BackButton from "@/components/BackButton.vue";

import "vue-select/dist/vue-select.css";

import { timeShiftsApi } from "@/api/timeShifts";
import { formatTimeSpan } from "@/tools/formatTime";

const store = useVistisStore();
const editable = ref(true);
const loading = ref(true);

const props = defineProps<{ timeShiftData: any }>();

const timeShift = reactive({
  id: props.timeShiftData.id,
  startTime: props.timeShiftData.startTime,
  endTime: props.timeShiftData.endTime,
  priceForFirstHour: props.timeShiftData.priceForFirstHour,
  priceForRemainingHours: props.timeShiftData.priceForRemainingHours,
});
const originalTimeShift = { ...timeShift };

const toast = useToast();

const onFormSubmit = async () => {
  const requestBody = {
    startTime: originalTimeShift.startTime,
    endTime: originalTimeShift.endTime,
    priceForFirstHour: timeShift.priceForFirstHour,
    priceForRemainingHours: timeShift.priceForRemainingHours,
  };

  if (originalTimeShift.startTime !== timeShift.startTime) {
    requestBody.startTime = formatTimeSpan(timeShift.startTime);
  }
  if (originalTimeShift.endTime !== timeShift.endTime) {
    requestBody.endTime = formatTimeSpan(timeShift.endTime);
  }
  console.log(timeShift);
  timeShiftsApi
    .edit(timeShift.id, requestBody)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
      editable.value = true;
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "",
        life: 3000,
      });
    });
  // } else {
  // toast.add({
  //   severity: "error",
  //   summary: "رسالة خطأ",
  //   detail: "يرجى تعبئة الحقول",
  //   life: 3000,
  // });
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        تفاصيل التوقيت
        <BackButton style="float: left" />
        <Button
          @click="editable = !editable"
          icon=" fa-solid fa-pen"
          text
          rounded
          class="p-button-primary p-button-text"
          v-tooltip.top="{
            value: 'تعديل بيانات التوقيت',
            fitContent: true,
          }"
        />
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
          <form @submit.prevent="onFormSubmit" :disabled="editable">
            <div class="grid p-fluid my-5">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="">
                  <label for="startTime">بداية التوقيت </label
                  >
                  <Calendar
                    inputId="startTime"
                    v-model="timeShift.startTime"
                    :timeOnly="true"
                    :disabled="editable"
                    selectionMode="single"
                    :manualInput="true"
                    :stepMinute="15"
                    :show-seconds="true"
                    :step-second="60"
                  />
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="">
                  <label for="stopDate"> نهاية التوقيت </label>
                  <Calendar
                    inputId="stopDate"
                    v-model="timeShift.endTime"
                    :timeOnly="true"
                    :disabled="editable"
                    selectionMode="single"
                    :manualInput="true"
                    :stepMinute="15"
                    :show-seconds="true"
                    :step-second="60"
                  />
                </span>
              </div>
            </div>
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="">
                  <label for="customerName">السعر مقابل الساعة الاولى</label>
                  <InputNumber
                    v-model="timeShift.priceForFirstHour"
                    :disabled="editable"
                    suffix="د.ل"
                  />
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="">
                  <label for="customerName">السعر مقابل باقي الساعات </label>
                  <InputNumber
                    v-model="timeShift.priceForRemainingHours"
                    :disabled="editable"
                    suffix="د.ل"
                  />
                </span>
              </div>
            </div>
            <div v-if="!editable">
              <Button
                @click="onFormSubmit"
                icon="fa-solid fa-check"
                label="تعديل"
              />
              <Button
                @click="editable = !editable"
                icon="fa-solid fa-ban"
                label="إلغاء التعديل"
                class="p-button-danger"
                style="margin-right: 0.5em"
              />
            </div>
          </form>
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
