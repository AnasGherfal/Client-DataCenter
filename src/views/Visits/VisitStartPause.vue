<script setup lang="ts">
import { visitApi } from "@/api/visits";
import moment from "moment";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";

const props = defineProps<{
  id: string;
  visitStatus: string;
}>();
const toast = useToast();

const showDialog = ref(false);
const startDate = ref();
const stopDate = ref();

const visitIcon = computed(() =>
  props.visitStatus == "Not Started" ? "fa-solid fa-play" : "fa-solid fa-stop"
);

const buttonColor = computed(() => (props.visitStatus == 'Not Started' ? "green" : "red"));
const tooltipValue = computed(() =>
props.visitStatus == "Not Started" ? " ابدأ الزيارة" : "انهي "
);
const startVisit = (id: string) => {
  visitApi
    .start(id, moment(startDate.value).format("YYYY-MM-DD HH:mm:ss"))
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: `${response.data.msg}`,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "رسالة فشل",
        detail: error.response.data.msg,
      });
    });
};

const stopVisit = (id: string) => {
  visitApi
    .stop(id, moment(stopDate.value).format("YYYY-MM-DD HH:mm:ss"))
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: `${response.data.msg}`,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "رسالة فشل",
        detail: error.response.data.msg,
      });
    });
};
</script>

<template>
  <Button
    :icon="visitIcon"
    :class="buttonColor"
    severity="info"
    text
    rounded
    v-tooltip="{ value: tooltipValue, fitContent: true }"

    @click="showDialog = !showDialog"
  >
  </Button>
  <Dialog
    v-model:visible="showDialog"
    :style="{ width: '450px' }"
    header="وقت الزيارة"
    :modal="true"
  >
    <div class="grid p-fluid ">
      <div v-if="props.visitStatus=='Not Started'" class="field col-12 md:col-6">
        <span class="">
          <label for="startTime">تاريخ بداية الزيارة </label>
          <Calendar
            inputId="startTime"
            v-model="startDate"
            dateFormat="yy/mm/dd"
            :showTime="true"
            selectionMode="single"
            :showButtonBar="true"
            :manualInput="true"
            :stepMinute="5"
            hourFormat="12"
          />
        </span>
        <Button text @click="() => startVisit(props.id)">
          <i class="fa-solid fa-check mx-2"></i>
          <span> تأكيد </span>
        </Button>
      </div>

      <div v-if="props.visitStatus=='In Progress'" class="field col-12 md:col-6">
        <span class="">
          <label for="stopDate">تاريخ انتهاء الزيارة </label>
          <Calendar
            inputId="stopDate"
            v-model="stopDate"
            dateFormat="yy/mm/dd"
            :showTime="true"
            selectionMode="single"
            :showButtonBar="true"
            :manualInput="true"
            :stepMinute="5"
            hourFormat="12"
          />
        </span>
        <Button text @click="() => stopVisit(props.id)">
          <i class="fa-solid fa-check mx-2"></i>
          <span> تأكيد </span>
        </Button>
      </div>
    </div>
  </Dialog>
</template>
<style>
.fa-solid.fa-stop {
  color: red;
}

.fa-solid.fa-play {
  color: green;
}



</style>