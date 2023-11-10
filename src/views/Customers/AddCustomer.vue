<script setup lang="ts">
import router from "@/router";
import BackButton from "@/components/BackButton.vue";
import CustomerForm from "../Customers/CustomerForm.vue";
import { customersApi } from "@/api/customers";
import { computed, getCurrentInstance, reactive, ref } from "vue";
import { email, required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import type { Customer } from "../../Modules/CustomerModule/CustomersModule";
import { isLibyanPhoneNumber, validateText } from "@/tools/validations";
import { useCustomersStore } from "@/stores/customers";

const store = useCustomersStore();

const loading = ref(false);
const IdentityDocumentsError = ref<string | null>(null);
const CompanyDocumentsError = ref<string | null>(null);
  const emit = defineEmits(["getCustomers"]);

const customer = reactive({
  name: "",
  email: "",
  primaryPhone: "",
  secondaryPhone: "",
  city: "",
  address: "",
  CompanyDocuments: null as File | null,
  IdentityDocuments: null as File | null,
});

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("الحقل مطلوب", required),
      validateText: helpers.withMessage(", حروف فقط", validateText),
      minLength: helpers.withMessage(
        "يجب أن يحتوي على الأقل 3 أحرف",
        minLength(3)
      ),
    },
    email: {
      required: helpers.withMessage("الحقل مطلوب", required),
      email: helpers.withMessage(" ليس عنوان بريد إلكتروني صالح", email),
    },
    city: { required: helpers.withMessage("الحقل مطلوب", required) },
    address: { required: helpers.withMessage("الحقل مطلوب", required) },
    primaryPhone: {
      required: helpers.withMessage("الحقل مطلوب", required),
      isLibyanPhoneNumber: helpers.withMessage(
        " , ليس رقم ليبي صالح",
        isLibyanPhoneNumber
      ),
    },
  };
});
const v$ = useVuelidate(rules, customer);

const onFormSubmit = async () => {
  const formData = new FormData();

  const result = await v$.value.$validate();
  if (!customer.IdentityDocuments || !customer.CompanyDocuments) {
  // At least one of the documents is null, so we should not make the API call
  if (!customer.IdentityDocuments) {
    IdentityDocumentsError.value = "الحقل مطلوب";
  } else {
    IdentityDocumentsError.value = "";
  }

  if (!customer.CompanyDocuments) {
    CompanyDocumentsError.value = "الحقل مطلوب";
  } else {
    CompanyDocumentsError.value = "";
  }
} else {
    // Both documents are not null, so proceed with the API call

  IdentityDocumentsError.value = "";
  CompanyDocumentsError.value = "";
  if (!result) return;

  formData.append("Name", customer.name);
  formData.append("City", customer.city);
  formData.append("Address", customer.address);
  formData.append("Email", customer.email);
  formData.append("PrimaryPhone", customer.primaryPhone);
  formData.append("SecondaryPhone", customer.secondaryPhone);
  formData.append("IdentityDocument", customer.IdentityDocuments as Blob);
  formData.append("CompanyDocuments", customer.CompanyDocuments as Blob);

  customersApi
    .create(formData)
    .then((response) => {
      emit("getCustomers")
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 2000,
      });

      setTimeout(() => {
        router.go(-1);
      }, 1);
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: e.response.data.msg,
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
      emit("getCustomers")
    });
  }
};


const toast = useToast();

async function onFileUpload(event: any, index: number) {
  const file = event.target.files[0];

  if (!file) return;

  if (index === 0) {
    customer.IdentityDocuments = file;
  } else {
    customer.CompanyDocuments = file;
  }

  // reset the error message
  if (index === 0) {
    IdentityDocumentsError.value = "";
  } else {
    CompanyDocumentsError.value = "";
  }
}

const resetForm = () => {
  customer.name = "";
  customer.email = "";
  customer.primaryPhone = "";
  customer.secondaryPhone = "";
  customer.address = "";
  customer.city = "";
  customer.IdentityDocuments = null;
  customer.CompanyDocuments = null;
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        إضافة عميل

        <BackButton style="float: left" />

        <Divider />
      </template>
      <template #content>
        <div>
          <form @submit.prevent="onFormSubmit()">
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText id="name" type="text" v-model="customer.name" />
                  <div style="height: 2px">
                    <span
                    v-for="error in v$.name.$errors"
                    :key="error.$uid"
                    style="color: red; font-weight: bold; font-size: small"
                    >
                    {{ error.$message }}</span
                    >
                  </div>
                  <label for="name">الاسم </label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText id="email" type="text" v-model="customer.email" />
                  <div style="height: 2px">
                    <span
                    v-for="error in v$.email.$errors"
                      :key="error.$uid"
                      style="color: red; font-weight: bold; font-size: small"
                    >
                      {{ error.$message }}</span
                      >
                    </div>
                    <label for="email">البريد الإلكتروني</label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                  id="city"
                    name="city"
                    type="text"
                    v-model="customer.city"
                    />
                    <div style="height: 2px">
                      <span
                      v-for="error in v$.city.$errors"
                      :key="error.$uid"
                      style="color: red; font-weight: bold; font-size: small"
                      >
                      {{ error.$message }}</span
                      >
                    </div>
                    <label for="city">المدينة</label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                  id="address"
                  name="address"
                  type="text"
                    v-model="customer.address"
                  />
                  <div style="height: 2px">
                    <span
                      v-for="error in v$.address.$errors"
                      :key="error.$uid"
                      style="color: red; font-weight: bold; font-size: small"
                      >
                      {{ error.$message }}</span
                    >
                  </div>
                  <label for="address">العنوان</label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputMask
                  id="primaryPhone"
                    v-model="customer.primaryPhone"
                    mask="+218999999999"
                    style="direction: ltr; text-align: end"

                  />
                  <div style="height: 2px">
                    <span
                      v-for="error in v$.primaryPhone.$errors"
                      :key="error.$uid"
                      style="
                        color: red;
                        direction: ltr;
                        font-weight: bold;
                        font-size: small;
                        "
                    >
                    {{ error.$message }}</span
                    >
                  </div>
                  <label for="primaryPhone">رقم هاتف </label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputMask
                  id="secondaryPhone"
                  v-model="customer.secondaryPhone"
                    mask="+218999999999"
                    style="direction: ltr; text-align: end"

                  />
                  <label for="secondaryPhone">رقم هاتف 2</label>
                </span>
              </div>
            </div>
            <div for="files" style="margin-bottom: 0.5rem">الملفات</div>
            <div class="grid p-fluid">
              <!-- First File Input -->
              <div class="field col-12 md:col-6 lg:col-4">
                <div class="file-input-label-text">تعريف شخصي</div>
                <label class="file-input-label" for="fileInput1">
                  <div class="file-input-content">
                    <div
                      class="file-input-icon"
                      v-if="!customer.IdentityDocuments?.name"
                    ></div>
                    <div class="file-input-text">
                      <i class="pi pi-upload"></i>
                      {{ customer.IdentityDocuments?.name || "ارفق ملف" }}
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
                <div v-if="IdentityDocumentsError" class="error-message">
                  {{ IdentityDocumentsError }}
                </div>
              </div>

              <!-- Second File Input -->
              <div class="field col-12 md:col-6 lg:col-4">
                <div class="file-input-label-text">تخويل من الشركة</div>
                <label class="file-input-label" for="fileInput2">
                  <div class="file-input-content">
                    <div
                      class="file-input-icon"
                      v-if="!customer.CompanyDocuments?.name"
                    ></div>

                    <div class="file-input-text">
                      <i class="pi pi-upload"></i>
                      {{ customer.CompanyDocuments?.name || "ارفق ملف" }}
                    </div>
                  </div>
                  <input
                    id="fileInput2"
                    style="display: none"
                    type="file"
                    @change="(event) => onFileUpload(event, 1)"
                    accept="*"
                  />
                </label>
                <div v-if="CompanyDocumentsError" class="error-message">
                  {{ CompanyDocumentsError }}
                </div>
              </div>
            </div>
            <Button
              @click="onFormSubmit()"
              icon="fa-solid fa-plus"
              label="إضافة"
            />
            <!-- <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" -->
            <!-- style="margin-right: .5em;" /> -->
            <Toast position="bottom-left" />
          </form>
        </div>
      </template>
    </Card>
  </div>
</template>
<style scoped>
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
.file-input-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%; /* Maintain the same height for the container */
}

.file-input-label-text {
  font-size: small;
  color: #9aafc3;
  margin-bottom: 0.1rem;
}

/* Your existing styling for other elements can go here */

/* Adjust vertical alignment for the text */

.error-message {
  color: red;
  font-weight: bold;
  font-size: small;
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
