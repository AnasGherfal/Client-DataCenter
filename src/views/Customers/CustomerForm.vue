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
  formData: FormData,

})
const docTypeOptions = ref([
  { value: 1, label: "نوع الملف 1" },
  { value: 2, label: "نوع الملف 2" },
]);
const toast = useToast();

const customers = ref(props.customers);

async function onFileUpload(event: any, index: number) {
  const file = event.target.files[0];
  const base64String = await convertFileToBase64(file);
  if (base64String && props.formData) { // Check if formData exists
    const docType = index === 0 ? 1 : 2;
    customers.value.files[index] = { file: base64String, docType };

    const fieldName = index === 0 ? "FirstFile.File" : "SecondFile.File";
    props.formData.append(fieldName, base64String);
  }
}

// ... (rest of the code)




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
