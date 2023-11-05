<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  email,
  minLength,
  required,
  helpers,
  integer,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { VisitHours } from "@/Modules/TimeShiftsModule/TimeShiftsModule";
import axios from "axios";
import moment from "moment";
import { timeShiftsApi } from "@/api/timeShifts";
import { days } from "@/tools/days";

const timeShifts: VisitHours = reactive({
  day: "",
  date: "",
  priceForFirstHour: null,
  priceForRemainingHours: null,
  startTime: "",
  endTime: "",
});
const ValidateDayOrDate = ref()
const loading = ref(false);
const emits = defineEmits(["getTimeShifts"]);

const rules = computed(() => {
  return {

    priceForFirstHour: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    priceForRemainingHours: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    startTime: { required: helpers.withMessage("الحقل مطلوب", required) },
    endTime: { required: helpers.withMessage("الحقل مطلوب", required) },
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, timeShifts);

const submitForm = async () => {
  const result = await v$.value.$validate();

  if(!timeShifts.date && !timeShifts.day && timeShifts.day!='0'){
    ValidateDayOrDate.value = "الحقل مطلوب";

  }else{
    ValidateDayOrDate.value = "";

  const send = reactive<VisitHours>({
    day: timeShifts.day,
    date: timeShifts.date,
    startTime: moment(timeShifts.startTime).format("HH:mm:ss"),
    endTime: moment(timeShifts.endTime).format("HH:mm:ss"),
    priceForFirstHour: timeShifts.priceForFirstHour,
    priceForRemainingHours: timeShifts.priceForRemainingHours,
  });

  

  if (result) {
    loading.value = true;
    timeShiftsApi
      .create(send)
      .then(function (response) {
        emits("getTimeShifts");
        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: `${response.data.msg}`,
          life: 3000,
        });
      })
      .catch(function (error) {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "رسالة تحذير",
          detail: error.response.data.msg,
          life: 3000,
        });
      })
      .finally(function () {
        loading.value = false;
        displayModal.value = false;
        resetForm();
      });
  }
}
};

const resetForm = () => {
  (timeShifts.date = ""),
    (timeShifts.day = ""),
    (timeShifts.priceForFirstHour = null),
    (timeShifts.priceForRemainingHours = null),
    (timeShifts.startTime = ""),
    (timeShifts.endTime = "");
};

const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
};
const closeModal = () => {
  displayModal.value = false;
};
</script>

<template>
  <Button
    @click="openModal"
    icon="fa-solid fa-plus"
    class="p-button-primary p-button mb-4"
    label="إضافة ساعة جديده"
  >
  </Button>
  <Dialog
    header="اضافة ساعه جديده"
    contentStyle="max-height: 80vh; max-width: 90vw; min-width:75vw; padding: 20px;"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :modal="true"
  >
    <form
      @submit.prevent="submitForm"
      style="height: 100%; display: flex; flex-direction: column; gap: 1.2rem"
    >
      <div class="grid p-fluid flex-grow-1">
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="p-float-label">
            <Dropdown
              v-model="timeShifts.day"
              id="day"
              :options="days"
              optionLabel="name"
              optionValue="value"
              placeholder="اختر اليوم"
              class="w-full"
            />

            <label for="day"> اليوم </label>

          </span>
          <div
                v-if="ValidateDayOrDate"
                style="color: red; font-weight: bold; font-size: small"
              >
                {{ ValidateDayOrDate }}
              </div>        </div>
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="p-float-label">
            <Calendar
              id="date"
              v-model="timeShifts.date"
              hourFormat="24"
              selectionMode="single"
              :manualInput="true"
            />
            <label for="date"> الموافق </label>
            <div
                v-if="ValidateDayOrDate"
                style="color: red; font-weight: bold; font-size: small"
              >
                {{ ValidateDayOrDate }}
              </div>
          </span>
        </div>
      </div>
      <div class="grid p-fluid flex-grow-1">
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="p-float-label">
            <Calendar
              id="startTime"
              v-model="timeShifts.startTime"
              :showTime="true"
              :timeOnly="true"
              hourFormat="24"
              selectionMode="single"
              :manualInput="true"
              :stepMinute="15"
              :show-seconds="true"
              :step-second="60"
            />
            <label for="startTime">وقت البداية </label>
            <div style="height: 2px">
              <span
                v-for="error in v$.startTime.$errors"
                :key="error.$uid"
                class="p-error"
                style="color: red; font-weight: bold; font-size: small"
                >{{ error.$message }}
              </span>
            </div>
          </span>
        </div>
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="p-float-label">
            <Calendar
              inputId="endTime"
              v-model="timeShifts.endTime"
              :showTime="true"
              :timeOnly="true"
              selectionMode="single"
              :manualInput="true"
              :stepMinute="15"
              hourFormat="24"
              :show-seconds="true"
              :step-second="60"
            />
            <label for="endTime">وقت النهاية </label>
            <div style="height: 2px">
              <span
                v-for="error in v$.endTime.$errors"
                :key="error.$uid"
                style="color: red; font-weight: bold; font-size: small"
                >{{ error.$message }}
              </span>
            </div>
          </span>
        </div>
      </div>
      <div class="grid p-fluid">
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="flex flex-column gap-2">
            <label
              for="priceFirstHour"
              style="font-size: small; font-weight: 100; color: lightslategray"
            >
              سعر الساعه الاولى
            </label>
            <InputNumber
              inputId="priceForFirstHour"
              v-model="timeShifts.priceForFirstHour"
              suffix=" دينار"
              :step="0.25"
              :min="0"
              :allowEmpty="false"
              :highlightOnFocus="true"
            />
            <div style="height: 2px">
              <span
                v-for="error in v$.priceForFirstHour.$errors"
                :key="error.$uid"
                style="color: red; font-weight: bold; font-size: small"
                >{{ error.$message }}
              </span>
            </div>
          </span>
        </div>
        <div class="field col-12 md:col-4 lg:col-4">
          <span class="flex flex-column gap-2">
            <label
              for="priceForRemainingHours"
              style="font-size: small; font-weight: 100; color: lightslategray"
            >
              سعر باقي الساعات
            </label>
            <InputNumber
              inputId="priceForRemainingHours"
              v-model="timeShifts.priceForRemainingHours"
              suffix=" دينار"
              :step="0.25"
              :min="0"
              :allowEmpty="false"
              :highlightOnFocus="true"
            />
            <div style="height: 2px">
              <span
                v-for="error in v$.priceForFirstHour.$errors"
                :key="error.$uid"
                style="color: red; font-weight: bold; font-size: small"
                >{{ error.$message }}
              </span>
            </div>
          </span>
        </div>
      </div>
    </form>
    <template #footer>
      <Button
        @click="submitForm"
        class="p-button-primry"
        icon="fa-solid fa-plus"
        label="إضافة"
        :loading="loading"
      />
      <Button
        @click="resetForm"
        icon="fa-solid fa-delete-left"
        label="مسح"
        class="p-button-danger"
        style="margin-right: 0.5em"
      />
      <Toast position="bottom-right" />
    </template>
  </Dialog>
</template>

<style></style>
