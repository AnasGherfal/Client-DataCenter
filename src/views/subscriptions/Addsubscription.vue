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

const store = useSubscriptionsStore();
const storeCustomer = useCustomersStore();

const loading = ref(false);
const ServicesList = ref();
const firstFileError = ref<string | null>(null);

const state: Subscription = reactive({
  serviceId: null,
  customerId: null,
  startDate: "",
  endDate: "",
  file: null,
});

type DocTypeOption = {
  value: number;
  text: string;
};
// Array of identity type options
const docTypeTypeOptions: DocTypeOption[] = [
  { value: 1, text: "تخويل" },
  { value: 2, text: "اثبات شخصي" },
];

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

  if (file && formData) {
    state.file = { file: file }; // Store the File object in the array

    const fieldName = index === 0 ? "File" : "File";
    formData.append(fieldName, file); // Append the File object to formData
  }
}
const docTypeOptions = ref([
  { value: 0, label: "اختر نوع الملف" },
  { value: 1, label: "نوع الملف 1" },
  { value: 2, label: "نوع الملف 2" },
]);
const formData = new FormData();

const submitForm = async () => {
  const result = await v$.value.$validate();
  if (!state.file) {
    firstFileError.value = "الحقل مطلوب";
  } else {
    firstFileError.value = "";
  
  if (result) {
    loading.value = true;
    if (state.file === null) {
      // File is null, do not proceed with the submission
      console.log("File is null");
      return;
    }
    // const subrequest: Subscription = reactive({
    //   serviceId: state.serviceId,
    //   customerId: state.customerId,
    //   startDate: moment(state.startDate).format("YYYY/MM/DD"),
    //   endDate: moment(state.endDate).format("YYYY/MM/DD"),

    //   file: state.file.file,
    //   docType: state.file.docType,
    // });

    console.log(typeof state.file);

    const customerId = state.customerId?.id ?? 0;

    formData.append("serviceId", String(state.serviceId));
    formData.append("customerId", String(customerId));
    formData.append("startDate", moment(state.startDate).format("YYYY/MM/DD"));
    formData.append("endDate", moment(state.endDate).format("YYYY/MM/DD"));
    // Append the first file as FormFile
    if (state.file instanceof File) {
      formData.append("file", state.file, state.file.name);
    }

    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    console.log("formData:", formDataObject);
    subscriptionApi
      .create(formData)
      .then((Response) => {
        toast.add({
          severity: "success",
          summary: "تمت اضافة اشتراك",
          detail: Response.data.msg,
          life: 3000,
        });
        console.log(Response);
        loading.value = false;
        store.getSubs();
        router.go(-1);
      })
      .catch(function (error) {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "هناك مشكلة",
          detail: "هنالك مشكلة في الوصول",
          life: 3000,
        });
      });
  } else {
    console.log("empty");
  }
}
  loading.value = false;
};

const resetForm = () => {
  (state.serviceId = null),
    (state.customerId = 0),
    (state.startDate = ""),
    (state.endDate = ""),
    (state.file = null);
};

const minDate = ref(new Date());

const selectedCustomer = ref();
const filteredCustomer = ref();

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...storeCustomer.customers];
    } else {
      filteredCustomer.value = storeCustomer.customers.filter(
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

                    {{ state.file?.file?.name || "ارفق ملف  1 " }}
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
