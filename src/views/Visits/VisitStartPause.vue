<script setup lang="ts">
import { visitApi } from "@/api/visits";
import moment from "moment";
import { useToast } from "primevue/usetoast";
import { computed, onMounted, reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, helpers } from "@vuelidate/validators";
import { formatTime } from "@/tools/formatTime";

const props = defineProps<{
  id: string;
  visitStatus: string;
  startTime: string;
}>();

const emit = defineEmits(["visits"]);
const toast = useToast();

const showDialog = ref(false);
const startDate = ref();
const stopDate = ref();
const startDateError = ref<string | null>(null);
const stopDateError = ref<string | null>(null);
const visitById = ref();

const visitStatus = reactive({value: props.visitStatus})
const visitIcon = computed(() =>
visitStatus.value == "Not Started" ? "fa-solid fa-play" : "fa-solid fa-stop"
);



const buttonColor = computed(() =>
visitStatus.value == "Not Started" ? "green" : "red"
);
const tooltipValue = computed(() =>
visitStatus.value == "Not Started" ? " ابدأ الزيارة" : "انهي "
);

onMounted(async () => {
});
async function getVisitById() {
  await visitApi.getById(props.id).then((response) => {
    showDialog.value = true;
    visitById.value = response.data.content;
  });
}



const startVisit = (id: string) => {
  if (!startDate.value) {
    startDateError.value = "الحقل مطلوب";
  } else {
    startDateError.value = "";

    visitApi
      .start(id, moment(startDate.value).format("YYYY-MM-DD HH:mm:ss"))
      .then((response) => {
        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: `${response.data.msg}`,
          life: 3000,
        });
        visitStatus.value = 'In Progress';
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "رسالة فشل",
          detail: error.response.data.msg,
          life: 3000,
        });
      })
      .finally(() => {
        emit("visits");
        showDialog.value = false;
      });
  }
};

const stopVisit = (id: string) => {
  if (!stopDate.value) {
    stopDateError.value = "الحقل مطلوب";
  } else {
    stopDateError.value = "";
    visitApi
      .stop(id, moment(stopDate.value).format("YYYY-MM-DD HH:mm:ss"))
      .then((response) => {
        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: `${response.data.msg}`,
          life: 3000,
        });
        visitStatus.value = 'Completed'
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "رسالة فشل",
          detail: error.response.data.msg,
          life: 3000,
        });
      })
      .finally(() => {
        showDialog.value = false;
      });
  }
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
    @click=getVisitById()
  >
  </Button>
  <Dialog
    v-model:visible="showDialog"
    :style="{ width: '320px' }"
    header="وقت الزيارة"
    :modal="true"
  >
    <div class="grid p-fluid">
      <div v-if="props.visitStatus == 'Not Started'">
        <div class="field col-12 md:col-8">
          <span class="p-float-label">
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
            <label for="startTime">تاريخ بداية الزيارة </label>
            <div
              v-if="startDateError"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ startDateError }}
            </div>
          </span>
          <Button text @click="() => startVisit(props.id)">
            <i class="fa-solid fa-check mx-2"></i>
            <span> تأكيد </span>
          </Button>
        </div>
      </div>

      <div v-if="props.visitStatus == 'In Progress'">
        <div class="field col-12 md:col-12">
          <span style="color: lightslategray">
            <label for="startTime" style="font-weight: lighter">
              بدأت الزيارة في
            </label>
            <span style="color: darkblue"> {{ formatTime(visitById.startTime) }} </span>
            <!-- <InputText
              :value="formatTime(visitById.startTime)"
              :disabled="true"
            /> -->
          </span>
        </div>
        <div class="field col-12 md:col-8">
          <span class="p-float-label">
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
            <label for="stopDate">تاريخ انتهاء الزيارة </label>
            <div
              v-if="stopDateError"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ stopDateError }}
            </div>
          </span>
          <Button
            text
            rounded
            icon="fa-solid fa-check"
            label="تأكيد"
            @click="() => stopVisit(props.id)"
          >
          </Button>
        </div>
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
