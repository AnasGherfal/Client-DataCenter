<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
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
import { customersApi } from "@/api/customers";
const store = useVistisStore();
const storeubscriptions = useSubscriptionsStore();

const storeCustomers = useCustomersStore();
const loading = ref(false);
const disableValidation = ref(false);
const name = ref<string>("");
const customers = ref();
const totalPages = ref(1);
const pageNumber = ref(1);
const pageSize = ref(10);
const currentPage = ref(0);
const filteredCustomer = ref();

const customerselect = ref();
const customerRepresentatives = ref();
const customerSubscriptions = ref();
const subscriptions = ref();
const customerSelected = ref(false); // Flag to track whether a customer is selected
const toast = useToast();

const visit = reactive({
  expectedStartTime: "",
  expectedEndTime: "",
  visitType: 1,
  notes: "",
  subscriptionId: null as any,
  representatives: [],
  companions: [],
});




const startDate = ref(new Date());
const endDate = ref(new Date());

const updateEndDate = () => {
  if (startDate.value > endDate.value) {
    endDate.value = startDate.value;
  }
};

const rules = computed(() => {
  return {
    subscriptionId: { required: helpers.withMessage(" الحقل مطلوب", required) },
    visitType: { required: helpers.withMessage("الحقل مطلوب", required) },
    expectedStartTime: {
      required: helpers.withMessage("  الحقل مطلوب", required),
    },
    expectedEndTime: {
      required: helpers.withMessage(" الحقل مطلوب", required),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه",
        minValue(visit.expectedStartTime)
      ),
    },
    representatives: {
      required: helpers.withMessage("  الحقل مطلوب", required),
    },
  };
});
const v$ = useVuelidate(rules, visit);

onMounted(async () => {
  getCustomers();
});

async function getCustomers() {
  if (name.value === undefined || name.value === null) {
    name.value = "";
  }
  await customersApi
    .get(pageNumber.value, pageSize.value, name.value)
    .then(function (response) {
      customers.value = response.data.content;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(customerselect, async (newValue) => {
  const customerId = newValue.id;

  if (newValue && customerId !== undefined) {
    try {
      loading.value = true;
      await getRepresentatives(customerId);
      await getSubscriptions(customerId);
      loading.value = false;
    } catch (error) {
      console.error("Error fetching representatives:", error);
    }
  }
});

const getRepresentatives = (id: string) => {
  representativesApi
    .get(id)
    .then(function (response) {
      customerRepresentatives.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getSubscriptions = (id: string) => {
  subscriptionApi
    .get(1, 50, id)
    .then(function (response) {
      customerSubscriptions.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    // Extract representative IDs
    const representativeIds = visit.representatives.map((rep: any) => rep.id);

    const payload = {
      subscriptionId: visit.subscriptionId ? visit.subscriptionId[0].id : "",
      visitType: +visit.visitType,
      representatives: representativeIds,
      expectedStartTime: visit.expectedStartTime,
      expectedEndTime: visit.expectedEndTime,
      notes: visit.notes,
      companions: visit.companions,
    };

    loading.value = true;
    visitApi
      .create(payload)
      .then(function (response) {
        toast.add({
          severity: "success",
          summary: "تمت الاضافه",
          detail: response.data.msg,
          life: 3000,
        });

        store.getVisits();
        router.go(-1);
      })
      .catch(function (error) {
        toast.add({
          severity: "error",
          summary: "فشلت الاضافه",
          detail: error.response.data.msg || "حدث خطأ ما",
          life: 3000,
        });
      });
  } else {
    console.log("not valid");
  }
};
const resetForm = () => {
  visit.expectedStartTime = "";
  (visit.expectedEndTime = ""),
    (visit.visitType = 0),
    (visit.notes = ""),
    (visit.subscriptionId = null),
    (visit.representatives = []),
    (visit.companions = []);
};

// const search = async (query: string) => {
//   await searchByName(query); // Call the searchByName function
//   filteredCustomer.value = customers.value; // Use the updated customers list
//   customerSelected.value = true;
// };

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...customers.value];
    } else {
      filteredCustomer.value = customers.value.filter(
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

                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.subscriptionId.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</span
                  >
                </div>
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
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.representatives.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="visitType"
                  v-model="visit.visitType"
                  :options="store.visitReasons"
                  optionValue="id"
                  optionLabel="name"
                />
                <label for="visitType">سبب الزيارة </label>
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.visitType.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="startTime"
                  v-model="visit.expectedStartTime"
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
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.expectedStartTime.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="endTime"
                  v-model="visit.expectedEndTime"
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
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.expectedEndTime.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</span
                  >
                </div>
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

          <Button @click="submitForm" icon="fa-solid fa-plus" label="إنشاء" />
          <Button
            @click="resetForm"
            icon="fa-solid fa-delete-left"
            label="مسح"
            class="p-button-danger"
            style="margin-right: 0.5rem"
          />
          <Toast position="bottom-left" />
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
