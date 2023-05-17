<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import moment from "moment";
import type { VisitHours } from "../../Models/TimeShifts/TimeShiftsModels";
import DeleteTimeShifts from "./DeleteTimeShifts.vue";
import AddTimeShifts from "./AddTimeShiftsView.vue";
import { timeShiftsApi } from "@/api/timeShifts";

const getVisitsHours = ref();
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
      getVisitsHours.value = response.data.content;
    })
    .catch(function (error) {
      toast.add({
        severity: "error",
        summary: "حدث خطأ",
        detail: "لم يتم جلب البيانات",
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
      selectedHours.value = null;
    });
};
const send = reactive<VisitHours>({
  name: "",
  startTime: "",
  endTime: "",
  priceForFirstHour: 0,
  priceForRemainingHour: 0,
});
const submitForm = async () => {
  dialog.value = true;
  loading.value = true;

  if (formChanged) {
    send.startTime = moment(selectedHours.value.startTime, "HH:mm").format(
      "HH:mm:ss"
    );
    send.endTime = moment(selectedHours.value.endTime, "HH:mm").format(
      "HH:mm:ss"
    );
  } else {
    send.startTime = selectedHours.value.startTime;
    send.endTime = selectedHours.value.endTime;
  }
  (send.name = selectedHours.value.name),
    (send.priceForFirstHour = selectedHours.value.priceForFirstHour),
    (send.priceForRemainingHour = selectedHours.value.priceForRemainingHour),
    timeShiftsApi
      .edit(selected, send)
      .then((response) => {
        toast.add({
          severity: "success",
          summary: "نجاح العمليه",
          detail: `${response.data.msg}`,
          life: 3000,
        });
      })
      .catch(function (error) {
        toast.add({
          severity: "error",
          summary: "حدث خطأ",
          detail: "لم يتم التعديل",
          life: 3000,
        });
      })
      .finally(() => {
        loading.value = false;
        dialog.value = false;
      });
};
let selected = 1;
const getIndex = (index: any) => {
  selected = index;
};

const position = ref("center");
const dialog = ref(false);

const openSave = (pos: string) => {
  position.value = pos;
  dialog.value = true;
};

const onCalendarClick = () => {
  formChanged.value = true;
};
</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="grid p-fluid">
        <div class="field col-12 md:col-4 mt-2">
          <span class="p-float-label">
            <Skeleton width="15rem" height="3rem" v-if="loading"></Skeleton>
            <Dropdown
              v-else
              @change="getIndex(selectedHours.id)"
              v-model="selectedHours"
              :options="getVisitsHours"
              optionLabel="name"
              placeholder="اختر ساعات للتعديل"
              class="w-full md:w-14rem"
              emptyMessage="لاتوجد ساعات, قم بإضافة ساعة"
            />
            <label for="hoursName">الساعات</label>
          </span>
        </div>
      </div>

      <div v-if="selectedHours">
        <!-- <LockButton @getdata="getTimeShifts()" :name="selectedHours.name" :id="selectedHours.id"
                                :status="selectedHours.status" type-lock="VisitTimeShift"></LockButton> -->

        <h3 style="display: inline-block">
          {{ selectedHours.name }}
        </h3>

        <DeleteTimeShifts
          v-if="selectedHours.status !== 5"
          :name="selectedHours"
          @getTimeShifts="getTimeShifts()"
        >
        </DeleteTimeShifts>

        <div class="grid p-fluid">
          <div class="field col-12 md:col-4 mt-2">
            <span class="p-float-label">
              <Calendar
                inputId="startTime"
                v-model="selectedHours.startTime"
                :showTime="true"
                :timeOnly="true"
                hourFormat="24"
                selectionMode="single"
                :manualInput="true"
                :stepMinute="15"
                :show-seconds="true"
                @click="onCalendarClick"
                :step-second="60"
              />
              <label for="startTime">من </label>
            </span>
          </div>
          <div class="field col-12 md:col-4 mt-2">
            <span class="p-float-label">
              <Calendar
                inputId="endTime"
                v-model="selectedHours.endTime"
                :showTime="true"
                :timeOnly="true"
                selectionMode="single"
                :manualInput="true"
                :stepMinute="15"
                hourFormat="24"
                @click="onCalendarClick"
                :show-seconds="true"
                :step-second="60"
              />
              <!-- <error v-for="error in v$.endWorkTime.$errors" :key="error.$uid" class="p-error ">
                                                                                        {{ error.$message }}</error> -->
              <label for="endTime">الى</label>
            </span>
          </div>
        </div>
        <div class="grid p-fluid">
          <div class="field col-12 md:col-4">
            <label for="priceFirstHour"> سعر الساعه الاولى </label>
            <InputNumber
              inputId="priceForFirstHour"
              v-model="selectedHours.priceForFirstHour"
              suffix=" دينار"
              :step="0.25"
              :min="0"
              :allowEmpty="false"
              :highlightOnFocus="true"
              @input="formChanged = true"
            />
          </div>
          <div class="field col-12 md:col-4">
            <label for="priceAfter">سعر باقي الساعات </label>
            <InputNumber
              inputId="priceForRemainingHour"
              v-model="selectedHours.priceForRemainingHour"
              suffix=" دينار"
              :step="0.25"
              :min="0"
              :allowEmpty="false"
              :highlightOnFocus="true"
              @input="formChanged = true"
            />
          </div>
        </div>
      </div>

      <Divider />

      <Button
        @click="openSave('bottom')"
        :disabled="!formChanged"
        icon="fa-solid fa-floppy-disk fa-flip fa-flip-hover"
        style="
          --fa-animation-duration: 2s;
          --fa-animation-delay: 5s;
          --fa-animation-iteration-count: 5;
        "
        label="تخزين"
        class="ml-2"
      />
      <AddTimeShifts @getTimeShifts="getTimeShifts"> </AddTimeShifts>

      <Dialog
        v-model:visible="dialog"
        :style="{ width: '450px' }"
        header="تأكيد"
        :modal="true"
        :draggable="false"
      >
        <div class="confirmation-content">
          <i
            class="pi pi-exclamation-triangle mr-3"
            style="font-size: 2rem; color: red"
          />
          <span>هل انت متأكد من تغيير وقت الساعات ؟</span>
        </div>
        <template #footer>
          <Button
            label="نعم"
            icon="pi pi-check"
            text
            @click="submitForm"
            :loading="loading"
          />

          <Button label="لا" icon="pi pi-times" text @click="dialog = false" />
        </template>
      </Dialog>
      <Toast position="bottom-left" />
    </form>
  </div>
</template>
