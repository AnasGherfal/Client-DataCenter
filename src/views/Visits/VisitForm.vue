<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from "@/stores/visits";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import addCompanion from "./Companions/addCompanion.vue";
import moment from "moment";
import type { Visit } from "@/Modules/VisitModule/VisitResponseModule";
import BackButton from "@/components/BackButton.vue";
import { useCustomersStore } from "@/stores/customers";
import { visitApi } from "@/api/visits";
import { representativesApi } from "@/api/representatives";
import { subscriptionApi } from "@/api/subscriptions";
import router from "@/router";
const store = useVistisStore();
const storeubscriptions = useSubscriptionsStore();

const storeCustomers = useCustomersStore();
const loading = ref(false);
const disableValidation = ref(false);

const visit: Visit = reactive({
  expectedStartTime: "2023-05-24T08:26:49.160Z",
  expectedEndTime: "2023-05-24T08:26:49.160Z",
  startTime: "",
  endTime: "",
  visitTypeId: null,
  notes: "",
  subscriptionId: null,
  representatives: [],
  companions: [],
});

interface visitReason {
  value: string; // Change the type to string to accept GUIDs as strings
  text: string;
}

const visitReasons: visitReason[] = [
  { value: "2712f755-9fb2-41d6-9498-683c2aeeb817", text: "صيانه" }, // Ensure the value is in quotes
  { value: "f55941d9-bb78-4336-b599-e11141268704", text: "انهاء عمل" }, // Make sure other values are also strings if needed
];

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
    representatives: {
      required: helpers.withMessage("  الحقل مطلوب", required),
    },
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

const customerselect = ref();
const customerRepresentatives = ref();
const representatives = ref();
const customerSubscriptions = ref();
const subscriptions = ref();

watch(customerselect, async (newValue) => {
  if (newValue) {
    try {
      loading.value = true;
      const response = await representativesApi.get();
      representatives.value = response.data.content.filter(
        (representative: any) => representative.customerName === newValue.name
      );
      visit.representatives = []; // Reset the representatives array
      customerRepresentatives.value = representatives.value; // Update the array with the selected representatives

      const subscriptionResponse = await subscriptionApi.getPages(
        storeubscriptions.pageNumber,
        storeubscriptions.pageSize
      );
      subscriptions.value = subscriptionResponse.data.content.filter(
        (subscription: any) => subscription.customerName === newValue.name
      );
      customerSubscriptions.value = subscriptions.value;
      loading.value = false;
    } catch (error) {
      console.error("Error fetching representatives:", error);
    }
  }
});

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    // Extract representative IDs
    const representativeIds = representatives.value.map((rep: any) => rep.id);
    // Modify the visit object to include only the representative IDs

    // Extract subscription IDs
    const subscriptionIds = subscriptions.value.map((sub: any) => sub.id);
    // Modify the visit object to include only the subscription IDs
    const subscriptionId =
      subscriptionIds.length > 0 ? subscriptionIds[0] : null; // Take the first subscription ID from the array

    const data = reactive({
      expectedStartTime: "2023-05-24T08:26:49.160Z",
      expectedEndTime: "2023-05-24T08:26:49.160Z",
      startTime: visit.startTime,
      endTime: visit.endTime,
      visitTypeId: visit.visitTypeId,
      notes: visit.notes,
      subscriptionId: subscriptionId,
      representatives: representativeIds,
      companions: visit.companions,
    });

    loading.value = true;
    console.log(data);
    visitApi
      .create(data)
      .then(function (response) {
        toast.add({
          severity: "success",
          summary: "تمت الاضافه",
          detail: response.data.msg,
          life: 3000,
        });

        console.log(response);
        store.getVisits();
        router.go(-1);
        setTimeout(() => {
          resetForm();
        }, 500);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("not valid");
  }
};
const resetForm = () => {
  visit.startTime = "";
  (visit.endTime = ""),
    (visit.visitTypeId = null),
    (visit.notes = ""),
    (visit.subscriptionId = null),
    (visit.representatives = []),
    (visit.companions = []);
};
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
                  v-model="customerselect"
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
                  :options="customerSubscriptions"
                  optionLabel="serviceName"
                  emptyMessage="هاذا العميل ليس لديه اشتراكات"
                  placeholder=" اختر اشتراك"
                  :selectionLimit="1"
                  :loading="loading"
                />
                <label for="customerName">اشتراكات</label>

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
                  v-model="visit.representatives"
                  :options="customerRepresentatives"
                  optionLabel="firstName"
                  placeholder="اختر"
                  emptySelectionMessage="ll"
                  :selectionLimit="2"
                  emptyMessage="هاذا العميل ليس لديه مخوليين"
                />
                <label for="representatives">المخولين</label>

                <error
                  v-for="error in v$.representatives.$errors"
                  :key="error.$uid"
                  class="p-error"
                  >{{ error.$message }}</error
                >
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="visitType"
                  v-model="visit.visitTypeId"
                  :options="visitReasons"
                  optionValue="value"
                  optionLabel="text"
                />
                <label for="visitType">سبب الزيارة </label>
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

            <div class="field col-12 md:col-8 lg:col-8">
              <span class="p-float-label">
                <Textarea v-model="visit.notes" rows="5" cols="77" />
                <label for="notes"> الملاحظات</label>
              </span>
            </div>
          </div>

          <!-- <label for="addCompanions"> هل تريد اضافة مرافقين؟ </label>
          <Checkbox id="addCompanions" v-model="disableValidation" binary="true" /> -->
          <addCompanion
            :compList="visit.companions"
            :disable-validation="disableValidation"
          />
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
