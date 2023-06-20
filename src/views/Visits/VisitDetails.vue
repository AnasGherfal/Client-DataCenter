<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import type { VisitEdit } from "@/Modules/VisitModule/VisitEditModule";
import BackButton from "@/components/BackButton.vue";
import type Textarea from "primevue/textarea";
import ComapanionsDataTable from "./Companions/CompanionsDataTable.vue";
import moment from "moment";
import { visitApi } from "@/api/visits";

const store = useVistisStore();
const props = defineProps<{ visit: any }>();
const editable = ref(true);
const dialog = ref(false);
const loading = ref(true);

const visit = reactive({
  id: props.visit.id,
  startTime: convertToDate(props.visit.startTime),
  endTime: convertToDate(props.visit.endTime),
  customerName: props.visit.customerName,
  visitTypeId: props.visit.visitTypeId,
  notes: props.visit.notes,
  totalMin: props.visit.totalMin,
  price: props.visit.price,
  invoiceId: 0,
  representatives: props.visit.representatives || [],
  companions: props.visit.companions,
  status: props.visit.status,
});

const visitReason = ref([{ name: "صيانه" }, { name: "انهاء عمل" }]);

const startDate = ref(new Date());

const rules = computed(() => {
  return {
    customerName: {
      required: helpers.withMessage("اسم العميل مطلوب", required),
    },
    representatives: {
      required: helpers.withMessage(" المخول مطلوب", required),
    },
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, visit);

type visitReason = {
  value: number;
  text: string;
};
// Array of identity type options

const visitReasons: visitReason[] = [
  { value: 1, text: "صيانه" },
  { value: 2, text: "انهاء عمل" },
];
function convertToDate(dateString: string): string {
  const date = moment(dateString).format("YYYY-MM-DD HH:mm"); // Convert to string format
  return date;
}
function convertDateFormat(dateString: any) {
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toISOString();
  return formattedDate;
}
const selectedRepresentatives = computed({
  get: () => visit.representatives,
  set: (value) => {
    visit.representatives = value;
  },
});
function updateRepresentatives() {
  visit.representatives = selectedRepresentatives.value;
}
const submitForm = async () => {
  const result = await v$.value.$validate();
  const selectedRepresentativeIds = visit.representatives.map(
    (rep: any) => rep.id
  );
  const data: VisitEdit = reactive({
    startTime: convertDateFormat(visit.startTime),
    endTime: convertDateFormat(visit.endTime),
    customerName: visit.customerName,
    visitTypeId: visit.visitTypeId,
    notes: visit.notes,
    totalMin: visit.totalMin,
    price: visit.price,
    invoiceId: null,
    representatives: selectedRepresentativeIds,
    companions: visit.companions,
  });

  if (result) {
    loading.value = true;
    visitApi
      .edit(props.visit.id, data)
      .then((response) => {
        console.log(response);
        editable.value = true;
        toast.add({
          severity: "success",
          summary: "Success Message",
          detail: "تمت إضافة زيارة",
          life: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    console.log("empty");
  }
};

function openDialog(representives: any) {
  dialog.value = true;
  selectedRepresentatives.value = representives;
}
</script>

<template>
  <div>
    <Card>
      <template #title>
        تفاصيل الزيارة
        <BackButton style="float: left" />

        <div v-if="visit.status === 5">
          <div class="warning-message">
            <div class="warning-message-icon"></div>
            <div class="warning-message-text">
              هذه الزيارة في حالة قفل لا يمكن التعديل
            </div>
          </div>
        </div>

        <span
          v-else-if="visit.status !== 5 && !store.loading"
          style="width: 30px; height: 30px; margin-right: 10px; margin-top: 0px"
        >
          <Button
            v-if="editable"
            @click="editable = !editable"
            icon=" fa-solid fa-pen"
            style="width: 30px; height: 30px; margin-right: 10px"
            class="p-button-primary p-button-text"
            v-tooltip="{ value: 'تعديل بيانات الزيارة', fitContent: true }"
          />
        </span>
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
          <form @submit.prevent="submitForm">
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    v-model="visit.customerName"
                    optionLabel="customerName"
                    placeholder=" اختر عميل"
                    :disabled="true"
                  />
                  <label for="customerName">العميل</label>
                </span>
              </div>
              <div class="field col-4 md:col-3 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    id="companionName"
                    v-model="visit.timeShift"
                    :disabled="true"
                  />
                  <label for="companionName"> وقت الزيارة </label>
                </span>
              </div>

              <div class="field col-4 md:col-3 lg:col-2">
                <span class="p-float-label">
                  <InputText
                    id="companionName"
                    v-model="visit.totalMin"
                    :readonly="true"
                    :disabled="true"
                  />
                  <label for="companionName"> مدة الزيارة </label>
                </span>
              </div>

              <div class="field col-4 md:col-3 lg:col-2">
                <span class="p-float-label">
                  <InputText
                    id="companionName"
                    v-model="visit.price"
                    :value="visit.price + ' دينار'"
                    :readonly="true"
                    :disabled="true"
                  />
                  <label for="companionName"> السعر </label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <Dropdown
                    id="visitTypeId"
                    v-model="visit.visitTypeId"
                    :options="visitReasons"
                    :disabled="editable"
                    optionValue="value"
                    optionLabel="text"
                  />
                  <label
                    style="color: black; top: -0.75rem; font-size: 12px"
                    for="visitType"
                    >سبب الزيارة
                  </label>
                </span>
              </div>

              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <Calendar
                    inputId="startTime"
                    v-model="visit.startTime"
                    dateFormat="yy/mm/dd"
                    :showTime="true"
                    selectionMode="single"
                    :minDate="startDate"
                    :showButtonBar="true"
                    :manualInput="true"
                    :stepMinute="5"
                    hourFormat="12"
                    :disabled="editable"
                  />
                  <label for="startTime">تاريخ بداية الزيارة </label>
                </span>
              </div>

              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <Calendar
                    inputId="startVisit"
                    v-model="visit.endTime"
                    dateFormat="yy/mm/dd"
                    :showTime="true"
                    selectionMode="single"
                    :minDate="startDate"
                    :showButtonBar="true"
                    :manualInput="true"
                    :stepMinute="5"
                    hourFormat="12"
                    :disabled="editable"
                  />
                  <label for="endTime">تاريخ انتهاء الزيارة </label>
                </span>
              </div>

              <div class="field col-8 md:col-3 lg:col-4">
                <span class="p-float-label">
                  <Textarea
                    id="companionName"
                    v-model="visit.notes"
                    :disabled="editable"
                  />

                  <label for="companionName"> الملاحظات </label>
                </span>
              </div>
            </div>

            <span
              style="font-size: 20px; font-weight: bold; margin-right: 0.5rem"
              for="representives"
            >
              المخوليين:
            </span>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <MultiSelect
                  v-model="selectedRepresentatives"
                  :options="store.representatives"
                  optionLabel="firstName"
                  placeholder="اختر"
                  :selectionLimit="2"
                  emptyMessage="هاذا العميل ليس لديه مخوليين"
                  :disabled="editable"
                  @change="updateRepresentatives"
                  :loading="store.loading"
                />

                <error
                  v-for="error in v$.representatives.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>
            <DataTable
              v-if="visit.representatives.length > 0"
              :value="visit.representatives"
            >
              <Column field="firstName" header="اسم المخول"></Column>
              <Column field="email" header=" البريد الالكتروني"></Column>
              <Column field="phoneNo" header="رقم الهاتف"> </Column>
              <Column field="identityNo" header="رقم الاثبات"></Column>
              <Column>
                <template #body="slotProps">
                  <Button
                    @click="openDialog(slotProps.data.representative)"
                    icon="fa-solid fa-circle-info"
                    severity="info"
                    text
                    rounded
                    v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                    style="width: 2rem; height: 1rem; margin-left: 0.5rem"
                  />

                  <Dialog
                    v-if="
                      selectedRepresentatives === slotProps.data.representative
                    "
                    v-model:visible="dialog"
                    :modal="true"
                  >
                    <div style="height-min: 30rem; width: 18rem">
                      <div class="justify-content-between">
                        <div>
                          <div class="text-center font-bold text-lg mb-2">
                            اسم واللقب:
                          </div>
                          <span class="block text-center text-xl"
                            >{{ slotProps.data.firstName }}
                            {{ slotProps.data.lastName }}</span
                          >

                          <div class="text-center font-bold mt-4 mb-2 text-lg">
                            البريد الإلكتروني:
                          </div>
                          <div class="text-center mb-3">
                            {{ slotProps.data.email }}
                          </div>
                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            رقم الهاتف:
                          </div>

                          <div class="text-center mb-3" style="direction: ltr">
                            {{ slotProps.data.phoneNo }}
                          </div>

                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            نوع الاثبات:
                          </div>

                          <div class="text-center mb-3">
                            {{ slotProps.data.identityType }}
                          </div>

                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            رقم الاثبات:
                          </div>

                          <div class="text-center mb-3" style="direction: ltr">
                            {{ slotProps.data.identityNo }}
                          </div>
                        </div>
                        <Divider />
                      </div>
                    </div>
                  </Dialog>
                </template>
              </Column>
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
              v-if="props.visit.companions == 0"
              style="font-style: italic; color: #999; margin-top: 0.5rem"
            >
              لايوجد مرافقين في هذه الزيارة
            </div>
            <div v-else>
              <ComapanionsDataTable :comp-list="visit.companions" :editable="editable"> 
              </ComapanionsDataTable>
            </div>
          </form>

          <div v-if="!editable">
            <Button
              @click="submitForm"
              icon="fa-solid fa-check"
              label="تعديل"
              type="submit"
            />
            <Button
              @click="editable = !editable"
              icon="fa-solid fa-ban"
              label="إلغاء التعديل"
              class="p-button-danger"
              style="margin-right: 0.5em"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<style scoped>
.representative-label {
  font-weight: bold;
}

.representative-value {
  font-weight: normal;
}
</style>
