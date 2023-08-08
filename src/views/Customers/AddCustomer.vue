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
    formData.append("FirstFile.DocType", customer.files[0].docType.toString());
  }

  // Append the second file if needed
  if (customer.files[1] && customer.files[1].file instanceof File) {
    formData.append(
      "SecondFile.File",
      customer.files[1].file,
      customer.files[1].file.name
    );
    formData.append("SecondFile.DocType", customer.files[1].docType.toString());
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
        life: 3000,
      });
      // router.go(-1);
      // setTimeout(() => {
      //   resetForm();
      // }, 500);
    })
    .catch(() => {
      toast.add({ severity: "error", summary: "خطأ", detail: "", life: 3000 });
    })
    .finally(() => {
      loading.value = false;
    });
};

const docTypeOptions = ref([
  { value: 0, label: "اختر نوع الملف" },
  { value: 1, label: "نوع الملف 1" },
  { value: 2, label: "نوع الملف 2" },
]);
const filteredDocTypeOptions = (index: any) => {
  const selectedFile = customer.files[index]?.file;
  if (selectedFile) {
    return docTypeOptions.value.slice(1);
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
                <Dropdown
                  v-if="customer.files[0]?.file"
                  :modelValue="customer.files[0].docType"
                  :options="filteredDocTypeOptions(0)"
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
                <Dropdown
                  v-if="customer.files[1]?.file"
                  :modelValue="customer.files[1].docType"
                  :options="filteredDocTypeOptions(0)"
                  optionValue="value"
                  optionLabel="label"
                  placeholder="Select a Document Type"
                  :visible="false"
                  @update:modelValue="(value: number) => (customer.files[1].docType = value)"
                />
              </div>

              <!-- <div class="field col-12 md:col-6 lg:col-4">
          <FileUpload
            style="
              width: 100%;
              height: 40px;
              border-radius: 10px;
              background-color: white;
              color: black;
              border-color: gray;
            "
            mode="basic"
            v-model="customers.files"
            name="File"
            url="./upload"
            chooseLabel=" ارفق ملف"
            cancelLabel="إلغاء"
            :showUploadButton="false"
            :showCancelButton="false"
            :maxFileSize="1000000"
            invalidFileSizeMessage="Exceeded the maximum file size"
          />
        </div> -->
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
        <Toast position="bottom-left" />
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
  color: black;
  border: 2px solid gray;
  text-align: center;
  padding: 0.5rem;
  cursor: pointer;
}

.file-input-label::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
