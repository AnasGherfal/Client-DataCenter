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
const firstFileError = ref<string | null>(null);
const secondFileError = ref<string | null>(null);

const customer: Customer = reactive({
  name: "",
  email: "",
  primaryPhone: "",
  secondaryPhone: "",
  address: "",
  files: [
    { file: null, docType: 0 },
    { file: null, docType: 0 }, // Add a second file
  ],
  subsicrptions: "",
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
const formData = new FormData();

const onFormSubmit = async () => {
  const result = await v$.value.$validate();
  if (!customer.files[0].file) {
    firstFileError.value = "الحقل مطلوب";
  } else {
    firstFileError.value = "";
  }

  // Validate the second file
  if (!customer.files[1].file) {
    secondFileError.value = "الحقل مطلوب";
  } else {
    secondFileError.value = "";
  
  if (result) {
    formData.append("name", customer.name);
    formData.append("email", customer.email);
    formData.append("primaryPhone", customer.primaryPhone);
    formData.append("secondaryPhone", customer.secondaryPhone);
    formData.append("address", customer.address);

    // Append the first file as FormFile
    if (customer.files[0].file instanceof File) {
      formData.append(
        "FirstFile.File",
        customer.files[0].file,
        customer.files[0].file.name
      );
      formData.append(
        "FirstFile.DocType",
        customer.files[0].docType.toString()
      );
    }

    // Append the second file if needed
    if (customer.files[1] && customer.files[1].file instanceof File) {
      formData.append(
        "SecondFile.File",
        customer.files[1].file,
        customer.files[1].file.name
      );
      formData.append(
        "SecondFile.DocType",
        customer.files[1].docType.toString()
      );
    }
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    console.log("formData:", formDataObject);

    // store.loading = true;
    //   customerForm.forEach((value, key) => {
    //   console.log(key, value);
    // });

    customersApi
      .create(formData)
      .then((response) => {
        store.getCustomers();
        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: response.data.msg,
          life: 2000,
        });
        setTimeout(() => {
          router.go(-1);
          resetForm();
        }, 1);
      })
      .catch((e) => {
        console.log(e.response.data.msg);

        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: e.response.data.msg,
          life: 3000,
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
};

const docTypeOptions = ref([
  { value: 1, label: "تعريف شخصي" },
  { value: 2, label: "ترخيص الشركة" },
]);
const filteredDocTypeOptions = (index: number) => {
  const selectedFile = customer.files[index]?.file;
  const selectedDocType = customer.files[index]?.docType;

  if (selectedFile) {
    const availableOptions = docTypeOptions.value.filter(
      (option) => option.value !== selectedDocType
    );
    return availableOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));
  } else {
    return docTypeOptions.value;
  }
};

const toast = useToast();

async function onFileUpload(event: any, index: number) {
  const file = event.target.files[0];

  if (file && formData) {
    const docType = index === 0 ? 1 : 2;
    customer.files[index] = { file: file, docType }; // Store the File object in the array

    const fieldName = index === 0 ? "FirstFile.File" : "SecondFile.File";
    const docTypeNumber = Number(docType); // Convert docType to a number
    formData.append(fieldName, file); // Append the File object to formData
    formData.append(fieldName + ".DocType", docTypeNumber.toString()); // Append the docType as a string
  }
}

const resetForm = () => {
  customer.name = "";
  customer.email = "";
  customer.primaryPhone = "";
  customer.secondaryPhone = "";
  customer.address = "";
  customer.files = [
    { file: "", docType: 0 },
    { file: "", docType: 0 },
  ];
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

                  <label for="name">اسم </label>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText id="email" type="text" v-model="customer.email" />
                  <label for="email">البريد الإلكتروني</label>
                  <div style="height: 2px">
                    <span
                      v-for="error in v$.email.$errors"
                      :key="error.$uid"
                      style="color: red; font-weight: bold; font-size: small"
                    >
                      {{ error.$message }}</span
                    >
                  </div>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputText
                    id="address"
                    type="text"
                    v-model="customer.address"
                  />
                  <label for="address">العنوان</label>
                  <div style="height: 2px">
                    <span
                      v-for="error in v$.address.$errors"
                      :key="error.$uid"
                      style="color: red; font-weight: bold; font-size: small"
                    >
                      {{ error.$message }}</span
                    >
                  </div>
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputMask
                    id="phoneNum1"
                    v-model="customer.primaryPhone"
                    mask="+218999999999"
                    style="direction: ltr; text-align: end"
                  />
                  <label for="phoneNum1">رقم هاتف </label>
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
                </span>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <InputMask
                    id="secondaryPhone"
                    v-model="customer.secondaryPhone"
                    mask="+218999999999"
                  />
                  <label for="secondaryPhone">رقم هاتف 2</label>
                </span>
              </div>
            </div>
            <div class="grid p-fluid">
              <!-- First File Input and DocType MultiSelect -->
              <div class="field col-12 md:col-6 lg:col-4">
                <label class="file-input-label" for="fileInput1">
                  <div class="file-input-content">
                    <div
                      class="file-input-icon"
                      v-if="!customer.files[0]?.file?.name"
                    ></div>

                    <div class="file-input-text">
                      <i class="pi pi-upload"></i>

                      {{ customer.files[0]?.file?.name || "ارفق ملف  1 " }}
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
                <div v-if="firstFileError" class="error-message">
                  {{ firstFileError }}
                </div>

                <Dropdown
                  v-if="customer.files[0]?.file"
                  :modelValue="customer.files[0].docType"
                  :options="filteredDocTypeOptions(1)"
                  optionValue="value"
                  optionLabel="label"
                  placeholder="Select a Document Type"
                  :visible="false"
                  @update:modelValue="(value: number) => (customer.files[0].docType = value)"
                />
              </div>

              <!-- Second File Input and DocType MultiSelect -->
              <div class="field col-12 md:col-6 lg:col-4">
                <label class="file-input-label" for="fileInput2">
                  <div class="file-input-content">
                    <div
                      class="file-input-icon"
                      v-if="!customer.files[1]?.file?.name"
                    ></div>

                    <div class="file-input-text">
                      <i class="pi pi-upload"></i>

                      {{ customer.files[1]?.file?.name || "ارفق ملف 2 " }}
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
                <div
                  v-if="secondFileError"
                  style="color: red; font-weight: bold; font-size: small"
                >
                  {{ secondFileError }}
                </div>
                <Dropdown
                  v-if="customer.files[1]?.file"
                  :modelValue="customer.files[1].docType"
                  :options="filteredDocTypeOptions(2)"
                  optionValue="value"
                  optionLabel="label"
                  placeholder="Select a Document Type"
                  :visible="false"
                  @update:modelValue="(value: number) => (customer.files[1].docType = value)"
                />
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
<style scoped >
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
