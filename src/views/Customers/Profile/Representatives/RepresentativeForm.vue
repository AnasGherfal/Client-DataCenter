<script setup lang="ts">
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import useVuelidate from "@vuelidate/core";
import { helpers, required, email, minLength } from "@vuelidate/validators";
import { computed, ref, getCurrentInstance } from "vue";
import { isLibyanPhoneNumber, validateText } from "@/tools/validations";
import { useToast } from "primevue/usetoast";

interface RepresentativeType {
  label: string;
  value: string;
}
const props = defineProps({
  representatives: {
    type: Object as () => Representatives,
    required: true,
  },
  submitButtonText: {
    type: String,
    required: true,
  },
  value: String,
});
const toast = useToast();
const loading = ref(false);
const firstFileError = ref<string | null>(null);
const secondFileError = ref<string | null>(null);

const representatives = ref(props.representatives);


async function onFileUpload(event: any, index: number) {
  const file = event.target.files[0];

  if (!file) return;

  if (index === 0) {
    props.representatives.IdentityDocuments = file;
  } else {
    props.representatives.RepresentationDocument = file;
  }
}

const instance = getCurrentInstance();

const onSubmitForm = async () => {
  const result = await v$.value.$validate();
  if (!props.representatives.IdentityDocuments) {
    firstFileError.value = "الحقل مطلوب";
  } else {
    firstFileError.value = "";
  }

  // Validate the second file
  if (!props.representatives.RepresentationDocument) {
    secondFileError.value = "الحقل مطلوب";
  } else {
    secondFileError.value = "";

    try {
      if (result) {
        loading.value = true;
        if (instance) {
          // Form submission logic here

          instance.emit("form-submit", representatives.value);
        }
      } else {
        toast.add({
          severity: "error",
          summary: "رسالة خطأ",
          detail: "يرجى تعبئة الحقول",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const rules = computed(() => {
  return {
    firstName: {
      required: helpers.withMessage("الحقل مطلوب", required),
      validateText: helpers.withMessage(
        ", حروف عربيه او انجليزيه فقط",
        validateText
      ),
      minLength: helpers.withMessage(
        "يجب أن يحتوي على الأقل 3 أحرف",
        minLength(3)
      ),
    },
    lastName: {
      required: helpers.withMessage("الحقل مطلوب", required),
      validateText: helpers.withMessage(
        ", حروف عربيه او انجليزيه فقط",
        validateText
      ),
      minLength: helpers.withMessage(
        "يجب أن يحتوي على الأقل 3 أحرف",
        minLength(3)
      ),
    },

    email: {
      required: helpers.withMessage("الحقل مطلوب", required),
      email: helpers.withMessage(" ليس عنوان بريد إلكتروني صالح", email),
    },
    phoneNo: {
      required: helpers.withMessage("الحقل مطلوب", required),
      isLibyanPhoneNumber: helpers.withMessage(
        " , ليس رقم ليبي صالح",
        isLibyanPhoneNumber
      ),
    },
    identityType: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    identityNo: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    type: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
  };
});

const v$ = useVuelidate(rules, representatives);

// const displayModal = ref(false);
// const openModal = () => {
//     displayModal.value = true;
// };
type IdentityTypeOption = {
  value: number;
  text: string;
};
// Array of identity type options
const identityTypeOptions: IdentityTypeOption[] = [
  { value: 1, text: "اثبات هويه" },
  { value: 2, text: "جواز سفر" },
];

const docTypeOptions = ref([
  { value: 1, label: "ملف شخصي" },
  { value: 2, label: "تخويل الشركة" },
]);

const fromDate = ref<string | null>(null);
const toDate = ref<string | null>(null);
const types = ref([
  { label: "مره", value: "0" },
  { label: "من-الى", value: "1" },
  { label: "طوال فترة العقد", value: "2" },
]);


</script>
<template>
  <form @submit.prevent="onSubmitForm">
    <div class="grid p-fluid">
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <InputText
            id="firstName"
            type="text"
            v-model="representatives.firstName"
          />
          <label for="firstName">الاسم </label>
          <div style="height: 2px; margin-bottom: 1rem">
            <span
              v-for="error in v$.firstName.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <InputText
            id="lastName"
            type="text"
            v-model="representatives.lastName"
          />
          <label for="lastName">اللقب </label>
          <div style="height: 2px; margin-bottom: 1rem">
            <span
              v-for="error in v$.lastName.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <InputText id="email" type="text" v-model="representatives.email" />
          <label for="email">البريد الإلكتروني</label>
          <div style="height: 2px">
            <span
              v-for="error in v$.email.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <InputMask
            v-model="representatives.phoneNo"
            mask="+218999999999"
            style="direction: ltr"
          />
          <label for="inputtext">رقم هاتف </label>
          <div style="height: 2px; margin-bottom: 1rem">
            <span
              v-for="error in v$.phoneNo.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <Dropdown
            v-model="representatives.identityType"
            :options="identityTypeOptions"
            optionValue="value"
            optionLabel="text"
            placeholder=" نوع الاثبات"
          />
          <label for="identityType">نوع الاثبات </label>
          <div style="height: 2px; margin-bottom: 1rem">
            <span
              v-for="error in v$.identityType.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>
      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <InputText id="inputtext" v-model="representatives.identityNo" />
          <label for="inputtext">رقم الاثبات </label>
          <div style="height: 2px; margin-bottom: 1rem">
            <span
              v-for="error in v$.identityNo.$errors"
              :key="error.$uid"
              style="color: red; font-weight: bold; font-size: small"
            >
              {{ error.$message }}
            </span>
          </div>
        </span>
      </div>

      <div class="field col-12 md:col-4 lg:col-4">
        <span class="p-float-label">
          <Dropdown
            v-model="representatives.type"
            :options="types"
            optionLabel="label"
            placeholder="Select Period Option"
          />
          <label for="periodOption">مدة الصلاحية</label>
        </span>
      </div>

      <!-- Conditionally render the date range input when "From To" is selected -->
      <span style="display: flex;" v-for=" type in representatives.type" >
      <div 
       v-if="type === '1'" class="field col-12 md:col-4 lg:col-4">
  
          <span class="p-float-label">
            <Calendar id="fromDate" type="date" v-model="representatives.from" />
            <label for="fromDate">من </label>
          </span>
        </div>
        <div v-if="type =='1'"
         class="field col-12 md:col-4 lg:col-4">

        <span class="p-float-label">
          <Calendar id="fromDate" type="date" v-model="representatives.to" />
          <label for="fromDate"> الى</label>
        </span>
      </div>
    </span>
      <!-- First File Input and DocType MultiSelect -->
      <div class="field col-12 md:col-4 lg:col-4">
        <!-- <span class="file-input-label-text ">تعريف شخصي</span> -->
        <label class="file-input-label" for="fileInput1">
          <div class="file-input-content">
            <div
              class="file-input-icon"
              v-if="!representatives.IdentityDocuments?.name"
            ></div>

            <div class="file-input-text">
              <i class="pi pi-upload"></i>

              {{ representatives.IdentityDocuments?.name || " تعريف شخصي" }}
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

      

      <!-- Second File Input and DocType MultiSelect -->
      <div class="field col-12 md:col-4 lg:col-4">
        <!-- <div class="file-input-label-text">تخويل من الشركة</div> -->
        <label class="file-input-label" for="fileInput2">
          <div class="file-input-content">
            <div
              class="file-input-icon"
              v-if="!representatives.RepresentationDocument?.name"
            ></div>

            <div class="file-input-text">
              <i class="pi pi-upload"></i>

              {{ representatives.RepresentationDocument?.name || "تخويل  " }}
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
      </div>


    </div>
    <Button
      style="margin-bottom: 50px"
      @click="onSubmitForm"
      icon="pi pi-check"
      :label="value"
      :loading="loading"
    />
    <Toast position="bottom-left" />
  </form>
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
.file-input-label-text {
  font-size: small;
  color: #9aafc3;
}

.file-input-label::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
