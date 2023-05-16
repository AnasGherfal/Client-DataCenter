<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import moment from "moment";
import type { VisitHours } from "../../Models/TimeShifts/TimeShiftsModels";
import DeleteTimeShifts from "./DeleteTimeShifts.vue";
import AddTimeShifts from "./AddTimeShiftsView.vue";
import { provide } from "vue";
import { timeShiftsApi } from "@/api/timeShifts";

//Needs Validation
const getVisitsHours = ref();
const selectedHours = ref();
const loading = ref(false);
provide("loading", loading);

const formChanged = ref(false);

const toast = useToast();
// const v$ = useVuelidate(rules, visitHours);

onMounted(async () => {
  getTimeShifts();
});

const getTimeShifts = async () => {
  loading.value = true;

  timeShiftsApi
    .get()
    .then((response) => {
      getVisitsHours.value = response.data.content;
      const startTimeString = response.data.content[0].startTime;
      const currentDate = new Date(); // Get the current date
      const [hours, minutes, seconds] = startTimeString.split(":"); // Split the time string

      // Set the time values to the current date
      currentDate.setHours(Number(hours));
      currentDate.setMinutes(Number(minutes));
      currentDate.setSeconds(Number(seconds));

      send.startTime = currentDate;
      console.log(typeof send.startTime);
    })
    .catch(function (error) {
      console.log(error);
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
  visible.value = true;
  loading.value = true;

  (send.name = selectedHours.value.name),
    (send.startTime = moment(selectedHours.value.startTime).format("HH:mm:ss")),
    (send.endTime = moment(selectedHours.value.endTime).format("HH:mm:ss")),
    (send.priceForFirstHour = selectedHours.value.priceForFirstHour),
    (send.priceForRemainingHour = selectedHours.value.priceForRemainingHour),
    await axios
      .put(`https://localhost:7003/api/VisitTimeShift/${selected}`, send)
      .then((response) => {
        toast.add({
          severity: "success",
          summary: "نجاح العمليه",
          detail: `${response.data.msg}`,
          life: 3000,
        });
        loading.value = false;
      })
      .catch(function (error) {
        console.log(send);
        toast.add({
          severity: "error",
          summary: "حدث خطأ",
          detail: "لم يتم التعديل",
          life: 3000,
        });

        console.log(error);
        loading.value = false;
      });
};
let selected = 1;
const getIndex = (index: any) => {
  selected = index;
};

const position = ref("center");
const visible = ref(false);

const openSave = (pos: string) => {
  position.value = pos;
  visible.value = true;
};
</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="grid p-fluid">
        <div class="field col-12 md:col-4 mt-2">
          <span class="p-float-label">
            <Skeleton width="85%" height="3rem" v-if="loading"></Skeleton>
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

        <DeleteTimeShifts
          v-if="selectedHours.status !== 5"
          :name="selectedHours"
          @getTimeShifts="getTimeShifts()"
        >
        </DeleteTimeShifts>

        <h3>
          {{ selectedHours.name }}
        </h3>

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
                @click="formChanged = true"
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
                @click="formChanged = true"
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
        v-model:visible="visible"
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

          <Button label="لا" icon="pi pi-times" text @click="visible = false" />
        </template>
      </Dialog>
      <Toast position="bottom-left" />
    </form>
  </div>
</template>
