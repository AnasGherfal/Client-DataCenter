<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from "vue";
import { email, required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import type { Customer } from "../../Modules/CustomerModule/CustomersModule";
import { isLibyanPhoneNumber, validateText } from "@/tools/validations";
import { useCustomersStore } from "@/stores/customers";

const store = useCustomersStore();

const props = defineProps({
  customers: {
    type: Object as () => Customer,
    required: true,
  },
  submitButtonText: {
    type: String,
  },
  value: String,
  loading: Boolean,
});

const toast = useToast();

const customers = ref(props.customers);

async function onFileUpload(event: any) {
  const file = event.target.files[0];
  const base64String = await convertFileToBase64(file);
  if (base64String) {
    const docType = 1; // Specify the desired docType value here
    customers.value.files = [{ file: base64String, docType }];
  }
}

const convertFileToBase64 = (file: File) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64String = result.split(",")[1];
        resolve(base64String);
      } else {
        resolve(null);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
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
const v$ = useVuelidate(rules, customers);

const instance = getCurrentInstance();

const submitForm = async () => {
  const result = await v$.value.$validate();

  try {
    if (result) {
      if (instance) {
        instance.emit("form-submit", customers.value);
      }
    } else {
      toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: "يرجى تعبئة الحقول",
        life: 3000,
      });
    }
  } catch (error: any) {
    console.log(error);
    console.log("error in form-submit");

    toast.add({
      severity: "error",
      summary: "رسالة خطأ",
      detail: error.response.data,
      life: 3000,
    });
  }
};

const isDisabled = ref(true);
</script>

<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="grid p-fluid">
        <div class="field col-12 md:col-6 lg:col-4">
          <span class="p-float-label">
            <InputText id="name" type="text" v-model="customers.name" />
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
            <InputText id="email" type="text" v-model="customers.email" />
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
            <InputText id="address" type="text" v-model="customers.address" />
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
              v-model="customers.primaryPhone"
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
              v-model="customers.secondaryPhone"
              mask="+218999999999"
            />
            <label for="secondaryPhone">رقم هاتف 2</label>
          </span>
        </div>
        <div class="field col-12 md:col-6 lg:col-4">
          <label class="file-input-label" for="fileInput">
            رقم هاتف 2
            <input
              id="fileInput"
              style="display: none"
              type="file"
              @change="onFileUpload"
              accept="*"
            />
          </label>
          <span class="selected-file-name"> selectedFileName </span>
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
        @click="submitForm"
        icon="fa-solid fa-plus"
        label="إضافة"
        :loading="store.loading"
      />
      <!-- <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" -->
      <!-- style="margin-right: .5em;" /> -->
      <Toast position="bottom-left" />
    </form>
  </div>
</template>

<style>
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
