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

const state: Subscription = reactive({
  serviceId: 0,
  customerId: 0,
  startDate: "",
  endDate: "",
  file: {
    file: null,
    docType: 0,
  },
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

console.log(state.startDate);

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

const onFileUpload = (event: any) => {
  const file = event.target.files[0];
  state.file = {
    file: file,
    docType: state.file.docType,
  };
};

const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    loading.value = true;
    if (state.file.file === null) {
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

    const customerId = state.customerId?.id ?? 0;

    const subdata = new FormData();
    subdata.append("serviceId", String(state.serviceId));
    subdata.append("customerId", String(customerId));
    subdata.append("startDate", moment(state.startDate).format("YYYY/MM/DD"));
    subdata.append("endDate", moment(state.endDate).format("YYYY/MM/DD"));
    subdata.append("file", state.file.file);
    subdata.append("docType", String(state.file.docType));

    subdata.forEach((value, key) => {
      console.log(key, value);
    });
    subscriptionApi
      .create(subdata)
      .then((Response) => {
        toast.add({
          severity: "success",
          summary: "تمت اضافة اشتراك",
          detail: Response.data.msg,
          life: 3000,
        });
        console.log(Response);
        loading.value = false;
        store.getSub();
        // router.go(-1);
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
  loading.value = false;
};

const resetForm = () => {
  (state.serviceId = null),
    (state.customerId = 0),
    (state.startDate = ""),
    (state.endDate = ""),
    (state.file.file = null);
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
                  <error
                    v-for="error in v$.customerId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
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
                  <error
                    v-for="error in v$.startDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
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
                  <error
                    v-for="error in v$.endDate.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
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
                  <error
                    v-for="error in v$.serviceId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  v-model="state.file.docType"
                  :options="docTypeTypeOptions"
                  optionValue="value"
                  optionLabel="text"
                  placeholder=" نوع الاثبات"
                />
                <label for="identityType">نوع الاثبات </label>
              </span>
            </div>
            <div class="form-group">
              <input
                style="
                  font-family: tajawal;
                  width: 100%;
                  height: 40px;
                  border-radius: 10px;
                  background-color: white;
                  color: black;
                  border-color: gray;
                "
                type="file"
                @change="onFileUpload($event)"
              />
            </div>
            <!-- <div class="field col-12 md:col-6 lg:col-4" style="height: 1%">
              <FileUpload
                style="
                  font-family: tajawal;
                  width: 100%;
                  height: 40px;
                  border-radius: 10px;
                  background-color: white;
                  color: black;
                  border-color: gray;
                "
                type="file"
                mode="basic"
                name="file"
                @change="onFileUpload"
                chooseLabel=" ارفق ملف"
                cancelLabel="إلغاء"
                :showUploadButton="false"
                :showCancelButton="false"
                :maxFileSize="5000000"
                invalidFileSizeMessage="Exceeded the maximum file size"
              />
            </div> -->
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
input[type="file"]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #084cdf;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #0d45a5;
}

error {
  font-size: 12px;
  font-weight: bold;
}

.p-dropdown {
  border-radius: 10px;
}

.p-float-label > label {
  right: 0.5rem;
  color: #6c757d;
  transition-duration: 0.2s;
}

/* .menuitem-content:hover {

} */
</style>
