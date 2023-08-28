<script setup lang="ts">
import RepresentativeForm from "./RepresentativeForm.vue";
import { toNumber } from "@vue/shared";
import { computed, reactive, ref } from "vue";
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { representativesApi } from "@/api/representatives";
import useVuelidate from "@vuelidate/core";
import { helpers, required, email, minLength } from "@vuelidate/validators";
import { isLibyanPhoneNumber, validateText } from "@/tools/validations";
const props = defineProps<{
  name: any;
}>();
const emit = defineEmits(["getRepresentatives"]);
const loading = ref(false);
const route = useRoute();
const hide1 = ref(false);
const hide2 = ref(false);
const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});
console.log(props.name);

const representatives = reactive({
  firstName: props.name.firstName,
  lastName: props.name.lastName,
  identityNo: props.name.identityNo,
  email: props.name.email,
  phoneNo: props.name.phoneNo,
  identityType: props.name.identityType, //1 personalId 2-authorized 3-representitive
  customerId: toNumber(userId.value),
  files: [
    {
      docType: props.name.files[0]?.docType,
      file: props.name.files[0]?.fileName,
      id: props.name.files[0]?.id,
    },
    {
      docType: props.name.files[1]?.docType,
      file: props.name.files[1]?.fileName,
      id: props.name.files[1]?.id,
    },
  ],
});
console.log(representatives.identityType);
console.log(props.name);
const toast = useToast();
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
  };
});
const v$ = useVuelidate(rules, representatives);

const onSubmitForm = async () => {
  const result = await v$.value.$validate();

  const formData = new FormData();

  formData.append("firstName", representatives.firstName);
  formData.append("lastName", representatives.lastName);
  formData.append("email", representatives.email);
  formData.append("phoneNo", representatives.phoneNo);
  formData.append("identityNo", representatives.identityNo);
  formData.append(
    "identityType",
    representatives.identityType?.toString() || ""
  );

  // Append the first file as FormFile
  if (representatives.files[0].file instanceof File) {
    formData.append(
      "FirstFile.File",
      representatives.files[0].file,
      representatives.files[0].file.name
    );
    formData.append(
      "FirstFile.DocType",
      representatives.files[0].docType.toString()
    );
  }

  if (representatives.files[1].file instanceof File) {
    formData.append(
      "SecondFile.File",
      representatives.files[1].file,
      representatives.files[1].file.name
    );
    formData.append(
      "SecondFile.DocType",
      representatives.files[1].docType.toString()
    );
  }
  const formDataObject: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  console.log("formData:", formDataObject);

  representativesApi
    .edit(props.name.id, formData)
    .then((response) => {
      emit("getRepresentatives");
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: response.data.msg,
        life: 3000,
      });
      displayModal.value = false;
    })
    .catch((error) => {
      toast.add({
        severity: "warn",
        summary: "خطا",
        detail: error,
        life: 3000,
      });
    });
};
const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
};
const closeModal = () => {
  displayModal.value = false;
};

// Array of identity type options
const identityTypeOptions = [
  { value: 1, text: "اثبات هويه" },
  { value: 2, text: "جواز سفر" },
];

const triggerFileInput = (index: any) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf, .doc, .docx, .jpg, .jpeg, .png";
  input.addEventListener("change", (event) => handleFileChange(event, index));
  input.click();
};

const handleFileChange = (event: any, index: any) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    // customer.files[index].file = selectedFile.name;
    representatives.files[index].file = selectedFile; // Store the file object
    if (selectedFile) {
      representatives.files[index].file = selectedFile;
      hide1.value = index === 0; // Only set hide1 if the first file was selected
      hide2.value = index === 1; // Only set hide2 if the second file was selected
    }
  }
};

const docTypes = [
  { value: "1", text: "بطاقة شخصية" },
  { value: "2", text: "رخصة من الشركة" },
];
const displayedFirstFileName = computed(() => {
  return representatives.files[0].file
    ? representatives.files[0].file.name
    : "No file selected";
});

const displayedSecondFileName = computed(() => {
  return representatives.files[1].file
    ? representatives.files[1].file.name
    : "No file selected";
});
</script>

<template>
  <div>
    <Button
      @click="openModal"
      icon=" fa-solid fa-pen"
      class="mr-2 p-button-primary p-button-text"
      text
      v-tooltip="{ value: 'تعديل ', fitContent: true }"
    />

    <Dialog
      header="تعديل المخول"
      contentStyle="max-height: 73vh; max-width: 40vw; min-width:50vw; padding: 20px;"
      v-model:visible="displayModal"
      :modal="true"
    >
      <template #default>
        <form @submit.prevent="onSubmitForm">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="name"
                  type="text"
                  v-model="representatives.firstName"
                />
                <label for="name">الاسم </label>
                <div style="height: 2px">
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
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="name"
                  type="text"
                  v-model="representatives.lastName"
                />
                <label for="name">اللقب </label>
                <div style="height: 2px">
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
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="email"
                  type="text"
                  v-model="representatives.email"
                />
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
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputMask
                  v-model="representatives.phoneNo"
                  mask="+218999999999"
                  style="direction: ltr"
                />
                <label for="inputtext">رقم هاتف </label>
                <div style="height: 2px">
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
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  v-model="representatives.identityType"
                  :options="identityTypeOptions"
                  optionValue="value"
                  optionLabel="text"
                  placeholder=" نوع الاثبات"
                />
                <label for="identityType">نوع الاثبات </label>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="inputtext"
                  v-model="representatives.identityNo"
                />
                <label for="inputtext">رقم الاثبات </label>
              </span>
            </div>
            <!-- First File Input and DocType MultiSelect -->

            <div class="field col-4 md:col-4 lg:col-4">
              <span class="p-float-label">
                <InputText
                  v-if="!hide1"
                  class="p-inputtext p-component"
                  v-model="representatives.files[0].file"
                  :disabled="true"
                />

                <InputText
                  v-else
                  class="p-inputtext p-component"
                  v-model="representatives.files[0].file"
                  :value="displayedFirstFileName"
                  :disabled="true"
                />
                <label for="secondaryPhone">اسم الملف</label>
              </span>
            </div>
            <div class="field col-4 md:col-4 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="docType"
                  v-model="representatives.files[0].docType"
                  :options="docTypes"
                  optionValue="value"
                  optionLabel="text"
                />
                <label for="secondaryPhone">نوع الملف</label>
              </span>
            </div>
            <div class="field col-4 md:col-3 lg:col-4">
              <div class="grid p-fluid">
                <Button
                  icon="fa-solid fa-upload"
                  class="p-button-text p-button-info"
                  @click="triggerFileInput(0)"
                >
                  رفع ملف
                </Button>
              </div>
            </div>
            <div class="field col-4 md:col-4 lg:col-4">
              <span class="p-float-label">
                <InputText
                  v-if="!hide2"
                  class="p-inputtext p-component"
                  v-model="representatives.files[1].file"
                  :disabled="true"
                />

                <InputText
                  v-else
                  class="p-inputtext p-component"
                  v-model="representatives.files[1].file"
                  :value="displayedSecondFileName"

                  :disabled="true"
                />
                <label for="secondaryPhone">اسم الملف</label>
              </span>
            </div>
            <div class="field col-4 md:col-4 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="docType"
                  v-model="representatives.files[1].docType"
                  :options="docTypes"
                  optionValue="value"
                  optionLabel="text"
                />
                <label for="secondaryPhone">نوع الملف</label>
              </span>
            </div>
          <div class="field col-4 md:col-3 lg:col-4">
            <div class="grid p-fluid">
              <Button
                icon="fa-solid fa-upload"
                class="p-button-text p-button-info"
                @click="triggerFileInput(1)"
              >
                رفع ملف
              </Button>
            </div>
          </div>
        </div>


          <Button
            type="submit"
            icon="pi pi-check"
            :loading="loading"
            label="تعديل"
          ></Button>
        </form>
        <!-- <RepresentativeForm
          @form-submit="onFormSubmit"
          :representatives="representatives"
          :submit-button-text="'Edit'"
          value="تعديل"
        >
        </RepresentativeForm> -->
      </template>
    </Dialog>
  </div>
</template>
