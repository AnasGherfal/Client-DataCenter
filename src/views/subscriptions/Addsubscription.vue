<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import BackButton from "@/components/BackButton.vue";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import router from "@/router";
import { useCustomersStore } from "@/stores/customers";
import type { Subscription } from "../../Modules/SubscriptionModule/SubscriptionsRequestModule";
import moment from "moment";
import { subscriptionApi } from "@/api/subscriptions";
import { serviceApi } from "@/api/service";
import { customersApi } from "@/api/customers";

const store = useSubscriptionsStore();
const storeCustomer = useCustomersStore();

const loading = ref(false);
const ServicesList = ref();
const firstFileError = ref<string | null>(null);
const totalPages = ref(1);
const pageNumber = ref(1);
const pageSize = ref(10);
const currentPage = ref(0);
const name = ref<string>("");
const customers = ref();

const state = reactive({
  serviceId: null,
  customerId: null as any,
  startDate: "",
  endDate: "",
  file: null as File | null,
});

type DocTypeOption = {
  value: number;
  text: string;
};

onMounted(async () => {
  serviceApi
    .get()
    .then(function (response) {
      ServicesList.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    });
});
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

const rules = computed(() => {
  return {
    customerId: { required: helpers.withMessage("الحقل مطلوب", required) },
    startDate: { required: helpers.withMessage("الحقل مطلوب", required) },
    endDate: {
      required: helpers.withMessage(" الحقل مطلوب", required),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الاشتراك يجب ان يكون بعد تاريخ البدايه",
        minValue(state.startDate)
      ),
    },
    serviceId: { required: helpers.withMessage("الحقل مطلوب", required) },
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, state);

async function onFileUpload(event: any, index: number) {
  const file = event.target.files[0];

  if (file) {
    state.file = file;
  }
}

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (!state.file) return (firstFileError.value = "الحقل مطلوب");

  const formData = new FormData();
  firstFileError.value = "";

  if (!result) return;
  loading.value = true;
  if (state.file === null) {
    // File is null, do not proceed with the submission
    console.log("File is null");
    return;
  }

  formData.append("serviceId", String(state.serviceId));
  formData.append("customerId", String(state.customerId?.id ?? 0));
  formData.append("startDate", moment(state.startDate).format("YYYY/MM/DD"));
  formData.append("endDate", moment(state.endDate).format("YYYY/MM/DD"));
  formData.append("file", state.file);

  subscriptionApi
    .create(formData)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تمت اضافة اشتراك",
        detail: response.data.msg,
        life: 3000,
      });
      console.log(response);
      loading.value = false;
      store.getSubs();
      router.go(-1);
    })
    .catch(function (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "هناك مشكلة",
        detail: error.response.data.msg || "هنالك مشكلة في الوصول",
        life: 3000,
      });
    });

  loading.value = false;
};

const resetForm = () => {
  (state.serviceId = null),
    (state.customerId = null),
    (state.startDate = ""),
    (state.endDate = ""),
    (state.file = null);
};

const minDate = ref(new Date());

const filteredCustomer = ref();

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
        إضافة اشتراك
        <BackButton style="float: left" />

        <Divider layout="horizontal" />
      </template>

      <template #content>
        <form @submit.prevent="submitForm">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <AutoComplete
                  v-model="state.customerId"
                  optionLabel="name"
                  :suggestions="filteredCustomer"
                  @complete="search"
                />
                <label for="customerName">العملاء</label>
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.customerId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="startDate"
                  v-model="state.startDate"
                  :minDate="minDate"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :showButtonBar="true"
                  :manualInput="false"
                />
                <label for="startDate">تاريخ بداية الاشتراك</label>
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.startDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Calendar
                  inputId="endDate"
                  v-model="state.endDate"
                  dateFormat="yy/mm/dd"
                  selectionMode="single"
                  :minDate="minDate"
                  :showButtonBar="true"
                  :manualInput="false"
                />
                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.endDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</span
                  >
                </div>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="subscriptionType"
                  :options="ServicesList"
                  option-value="id"
                  optionLabel="name"
                  v-model="state.serviceId"
                  placeholder="اختر الباقه"
                  emptyMessage="لايوجد باقات"
                />
                <label for="subscriptionType">الباقة</label>
                <div style="height: 2px">
                  <span
                    style="color: red; font-weight: bold; font-size: small"
                    v-for="error in v$.serviceId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</span
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <label class="file-input-label" for="fileInput1">
                <div class="file-input-content">
                  <div class="file-input-icon"></div>

                  <div class="file-input-text">
                    <i class="pi pi-upload"></i>

                    {{ state.file?.name || "ارفق ملف  1 " }}
                  </div>
                </div>

                <input
                  id="fileInput1"
                  style="display: none"
                  type="file"
                  @change="(event) => onFileUpload(event, 0)"
                  accept="*"
                />
              </label>
              <div
                v-if="firstFileError"
                style="color: red; font-weight: bold; font-size: small"
              >
                {{ firstFileError }}
              </div>
            </div>
          </div>
          <Button
            class="p-button-primry"
            icon="fa-solid fa-plus"
            label="إضافة"
            type="submit"
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
        </form>
      </template>
    </Card>
  </div>
</template>
<style>
.p-dropdown {
  border-radius: 10px;
}

.p-float-label > label {
  right: 0.5rem;
  color: #6c757d;
  transition-duration: 0.2s;
}

.file-input-label {
  display: inline-block;
  position: relative;
  overflow: hidden;
  font-family: tajawal;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  color: #708da9;
  border: 1px solid #d3dbe3;
  text-align: center;
  padding: 0.7rem;
  cursor: pointer;
}
div.field > label {
  margin-bottom: 0;
}
.file-input-label::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
