<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import router from "@/router";
import type { Visit } from "@/Modules/VisitModule/VisitRequestModule";
import BackButton from "@/components/BackButton.vue";
import type Textarea from "primevue/textarea";
import ComapanionsDataTable from "./Companions/CompanionsDataTable.vue";

const store = useVistisStore();
const props = defineProps<{ visit: any }>();
const editable = ref(true);
const dialog = ref(false);
const selectedRepresentative = ref(null);

const visit: Visit = reactive({
  id: props.visit.id,
  startTime: props.visit.startTime,
  endTime: props.visit.endTime,
  customerName: props.visit.customerName,
  visitType: props.visit.visitType,
  notes: props.visit.notes,
  timeShift: props.visit.timeShift,
  totalMin: props.visit.totalMin,
  price: props.visit.price,
  invoiceId: props.visit.invoiceId,
  representives: props.visit.representative || [],
  companions: props.visit.companions,
});

const compList = reactive([{}]);

const visitReason = ref([{ name: "صيانه" }, { name: "انهاء عمل" }]);

let today = new Date();
let month = today.getMonth;
let year = today.getFullYear;
let hours = today.getHours();
const startDate = ref(new Date());

const minDate = ref(new Date());

const invalidDates = ref();

const searchUsers = () => {};

console.log(visit);

const rules = computed(() => {
  return {
    customerName: {
      required: helpers.withMessage("اسم العميل مطلوب", required),
    },
    representives: {
      required: helpers.withMessage(" المخول مطلوب", required),
    },
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, visit);

const submitForm = async () => {
  const result = await v$.value.$validate();

  // if (result) {
  //     axios.put(`http://localhost:3000/visits${data.customer.id, visit}`)
  //         .then(function (response) {
  //             editable.value = true;
  //             toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });

  //         })
  //         .catch(function (error) {
  //             console.log(error)

  //         })

  // } else {
  //     console.log("empty")
  // }
};

function backButton() {
  router.go(-1);
}
function openDialog(representives: any) {
  dialog.value = true;
  selectedRepresentative.value = representives;
}
</script>

<template>
  <div>
    <Card>
      <template #title>
        تفاصيل الزيارة
        <BackButton style="float: left" />

        <Button
          v-if="editable"
          @click="editable = !editable"
          icon=" fa-solid fa-pen"
          style="width: 30px; height: 30px; margin-right: 10px"
          class="p-button-primary p-button-text"
          v-tooltip="{ value: 'تعديل بيانات الزيارة', fitContent: true }"
        />
      </template>
      <template #content>
        <div>
          <form @submit.prevent="submitForm">
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    v-model="visit.customerName"
                    optionLabel="customerName"
                    placeholder=" اختر عميل"
                    :disabled="editable"
                  />
                  <label for="customerName">العميل</label>
                </span>
              </div>

              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    id="visitType"
                    type="text"
                    v-model="visit.visitType"
                    :disabled="editable"
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

              <div class="field col-6 md:col-3 lg:col-2">
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

              <div class="field col-6 md:col-3 lg:col-2">
                <span class="p-float-label">
                  <InputText
                    id="companionName"
                    v-model="visit.price"
                    :readonly="true"
                    :disabled="true"
                  />
                  <label for="companionName"> السعر </label>
                </span>
              </div>

              <div class="field col-6 md:col-3 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    id="companionName"
                    v-model="visit.timeShift"
                    :disabled="editable"
                  />
                  <label for="companionName"> وقت الزيارة </label>
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
            <div class="grid" style="margin-right: 10rem">
              <Card
                class="col-12 md:col-4"
                style="
                  display: flex;
                  flex-wrap: wrap;
                  width: 10rem;
                  max-height: 5rem;
                  margin: 1rem;
                "
                v-for="representative in props.visit.representives"
                :key="representative.id"
              >
                <template #content>
                  <div
                    class="representative-field"
                    style="
                      margin-bottom: 1rem;
                      display: flex;
                      position: absolute;
                    "
                  >
                    <span class="representative-value"
                      >{{ representative.firstName }}
                      {{ representative.lastName }}</span
                    >

                    <Button
                      @click="openDialog(representative)"
                      icon="fa-solid fa-circle-info"
                      severity="info"
                      text
                      rounded
                      v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                      style="width: 2rem; height: 1rem; margin-left: 0.5rem"
                    />
                  </div>

                  <Dialog
                    v-if="selectedRepresentative === representative"
                    v-model:visible="dialog"
                    :modal="true"
                  >
                    <div style="height-min: 30rem; width: 18rem">
                      <div class="justify-content-between">
                        <div>
                          <div class="text-center font-bold text-lg mb-2">
                            اسم المخول:
                          </div>
                          <span class="block text-center text-xl"
                            >{{ representative.firstName }}
                            {{ representative.lastName }}</span
                          >

                          <div class="text-center font-bold mt-4 mb-2 text-lg">
                            البريد الإلكتروني:
                          </div>
                          <div class="text-center mb-3">
                            {{ representative.email }}
                          </div>
                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            رقم الهاتف:
                          </div>

                          <div class="text-center mb-3" style="direction: ltr">
                            {{ representative.phoneNo }}
                          </div>

                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            نوع الاثبات:
                          </div>

                          <div class="text-center mb-3">
                            {{ representative.identityType }}
                          </div>

                          <div class="font-bold mb-2 text-lg text-center mt-4">
                            رقم الاثبات:
                          </div>

                          <div class="text-center mb-3" style="direction: ltr">
                            {{ representative.identityNo }}
                          </div>
                        </div>
                        <Divider />
                      </div>
                    </div>
                  </Dialog>
                </template>
              </Card>
            </div>
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
            <div v-if="props.visit.companions == 0">لايوجد</div>
            <div v-else class="field col-12 md:col-6 lg:col-4">
              <ComapanionsDataTable :comp-list="visit.companions">
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
