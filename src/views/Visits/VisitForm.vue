<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import addCompanion from "./Companions/addCompanion.vue";
import type { Companions } from "../../Modules/VisitModule/companionsModule";
import moment from "moment";
import type { Visit } from "@/Modules/VisitModule/VisitModule";
import BackButton from "@/components/BackButton.vue";
import router from "@/router";
import axios from "axios";
import { useCustomersStore } from "@/stores/customers";

const store = useVistisStore();
const storeCustomers = useCustomersStore();
const loading = ref(false);

const visit: Visit = reactive({
  expectedStartTime: "2023-05-24T08:26:49.160Z",
  expectedEndTime: "2023-05-24T08:26:49.160Z",
  startTime: "",
  endTime: "",
  visitTypeId: null,
  notes: "",
  subscriptionId: null,
  invoiceId: 0,
  representives: [],
  companions: [],
});


const visitReason = ref([{ name: "صيانه" }, { name: "انهاء عمل" }]);

const startDate = ref(new Date());
const endDate = ref(new Date());

const date = new Date(moment(visit.startTime).format("hh:mm a"));
const minDate = ref(date);

const updateEndDate = () => {
  if (startDate.value > endDate.value) {
    endDate.value = startDate.value;
  }
};

const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {};

const rules = computed(() => {
  return {
    subscriptionId: { required: helpers.withMessage(" الحقل مطلوب", required) },
    visitTypeId: { required: helpers.withMessage("الحقل مطلوب", required) },
    startTime: { required: helpers.withMessage("  الحقل مطلوب", required) },
    endTime: {
      required: helpers.withMessage(" الحقل مطلوب", required),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه",
        minValue(visit.startTime)
      ),
    },
    representives: {
      required: helpers.withMessage("  الحقل مطلوب", required),
    },
    companions: { required: helpers.withMessage("  الحقل مطلوب", required) },
  };
});

// Validate that end date is not before start date
const isEndDateValid = computed(() => {
  return !visit.endTime || !visit.startTime || visit.endTime >= visit.startTime;
});

const toast = useToast();

const v$ = useVuelidate(rules, visit);

function invalidDate() {
  if (visit.endTime <= visit.startTime) {
    alert("error");
  }
}

const submitForm = async () => {
  console.log(visit.startTime);

  const result = await v$.value.$validate();
  if (result) {
    loading.value = true;

    setTimeout(() => {
      router.go(-1);
      loading.value = false;
    }, 1000);

    // const subrequest: Visit = reactive({
    //     customerName: visit.customerName.customerName,
    //     authorizedName: visit.authorizedName.authorizedName

    // })

    await axios
      .post("http://localhost:3000/visits", visit)
      .then(function (response) {
        toast.add({
          severity: "success",
          summary: "تمت الاضافه",
          detail: response.data.msg,
          life: 3000,
        });

        console.log(visit);
        console.log(response);
        store.getdata();
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("not valid");
  }
};

const customerselect = ref();

const customer = ref();
const filteredCustomer = ref();

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...storeCustomers.customers];
    } else {
      filteredCustomer.value = storeCustomers.customers.filter(
        (users: { name: String }) => {
          return users.name.toLowerCase().startsWith(event.query.toLowerCase());
        }
      );
    }
  }, 250);
};

 const resetForm = () => {
  visit.expectedStartTime= "";
  visit.expectedEndTime= "";
  visit.startTime= "";
  visit.endTime= "",
  visit.visitTypeId= null,
  visit.notes= "",
  visit.subscriptionId= null,
  visit.invoiceId= 0,
  visit.representives= [],
  visit.companions= []

 };
</script>

<template>
  <div>
    <Card>
      <template #title>
        إنشاء زيارة
        <BackButton style="float: left" />

        <Divider />
      </template>
      <template #content>
        <form @submit.prevent="submitForm">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <AutoComplete
                  v-model="customer"
                  optionLabel="name"
                  :suggestions="filteredCustomer"
                  @complete="search"
                />
                <label for="customerName">العملاء</label>
                <!-- <div style="height: 2px">
                  <error
                    v-for="error in v$.customer.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div> -->
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <MultiSelect
                  v-model="visit.subscriptionId"
                  :options="storeCustomers.customers"
                  optionLabel="name"
                  :filter="true"
                  placeholder=" اختر الخدمة"
                  :selectionLimit="1"
                />
                <label for="customerName">خدمات</label>

                <error
                  v-for="error in v$.subscriptionId.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <MultiSelect
                  v-model="visit.representives"
                  :options="store.visits"
                  optionLabel="representives"
                  placeholder="اختر"
                  emptySelectionMessage="ll"
                  :selectionLimit="2"
                />
                <label for="representives">المخولين</label>

                <error
                  v-for="error in v$.representives.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id=""
                  v-model="visit.visitTypeId"
                  :options="visitReason"
                  optionLabel="name"
                />
                <label for="visitReason">سبب الزيارة </label>
                <error
                  v-for="error in v$.visitTypeId.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
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
                  @onChange="updateEndDate"
                />
                <label for="startTime">تاريخ بداية الزيارة </label>
                <error
                  v-for="error in v$.startTime.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="endTime"
                  v-model="visit.endTime"
                  dateFormat="yy/mm/dd"
                  :showTime="true"
                  selectionMode="single"
                  :minDate="startDate"
                  :showButtonBar="true"
                  :manualInput="true"
                  :stepMinute="5"
                  hourFormat="12"
                />
                <label for="endTime">تاريخ انتهاء الزيارة </label>
                <error
                  v-for="error in v$.endTime.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>

            <div class="field col-6 md:col-3 lg:col-2">
              <span class="p-float-label">
                <InputText id="companionName" :readonly="true" />
                <label for="companionName"> مدة الزيارة </label>
              </span>
            </div>
            <div class="field col-6 md:col-3 lg:col-2">
              <span class="p-float-label">
                <InputText id="companionName" :readonly="true" />
                <label for="companionName"> السعر </label>
              </span>
            </div>

            <div class="field col-12 md:col-8 lg:col-8">
              <span class="p-float-label">
                <Textarea v-model="visit.notes" rows="5" cols="77" />
                <label for="notes"> الملاحظات</label>
              </span>
            </div>
          </div>

          <addCompanion :compList="visit.companions" />
          <br /><br />


          <Button
            @click="submitForm"
            icon="fa-solid fa-plus"
            label="إنشاء"
            type="submit"
          />
          <Button
            @click="resetForm"
            icon="fa-solid fa-delete-left"
            label="مسح"
            class="p-button-danger"
            style="margin-right: 0.5rem"
          />
        </form>
      </template>
    </Card>
  </div>
</template>
<style>
.p-button-icon {
  padding-left: 0;
}

.p-datepicker.p-datepicker-timeonly .p-timepicker {
  border-top: 0 none;
  direction: ltr;
}
</style>
