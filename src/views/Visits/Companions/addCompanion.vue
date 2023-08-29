<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Companions } from "@/Modules/VisitModule/companionsModule";
import ComapanionsDataTable from "./CompanionsDataTable.vue";

const props = defineProps(["compList", "disableValidation"]);

const companion: Companions = reactive({
  firstName: "",
  lastName: "",
  identityNo: "",
  identityType: null,
  jobTitle: "",
});

const rules = computed(() => {
  // return {
  //   firstName: {
  //     required: helpers.withMessage("ادخل اسم المرافق", required),
  //     minLength: helpers.withMessage(
  //       "يجب أن يحتوي على الأقل 3 أحرف",
  //       minLength(3)
  //     ),
  //   },
  //   lastName: {
  //     required: helpers.withMessage("ادخل اسم المرافق", required),
  //     minLength: helpers.withMessage(
  //       "يجب أن يحتوي على الأقل 3 أحرف",
  //       minLength(3)
  //     ),
  //   },

  //   jobTitle: { required: helpers.withMessage("يجب ادخال الصفة", required) },
  //   identityType: {
  //     required: helpers.withMessage("اختر نوع اثبات الهوية", required),
  //   },
  //   identityNo: { required: helpers.withMessage("ادخل رقم الاثبات", required) },
  // };
});

const toast = useToast();

const v$ = useVuelidate(rules, companion);

const submitFormCom = async () => {

  const nameRegex = /^[^\d]+$/; // Regex to match names without numbers
const numberRegex = /^\d+$/; // Regex to match numbers without letters

if (
  !companion.firstName ||
  !companion.lastName ||
  !companion.identityType ||
  !companion.identityNo ||
  !companion.jobTitle
) {
  toast.add({
    severity: "warn",
    summary: "فشل",
    detail: "يرجى تعبئة جميع الحقول المطلوبة",
    life: 3000,
  });
  return;
} else if (!nameRegex.test(companion.firstName) || !nameRegex.test(companion.lastName)) {
  toast.add({
    severity: "warn",
    summary: "فشل",
    detail: "الاسم يجب أن يحتوي على أحرف فقط",
    life: 3000,
  });
  return;
} else if (!numberRegex.test(companion.identityNo)) {
  toast.add({
    severity: "warn",
    summary: "فشل",
    detail: "رقم الاثبات يجب أن يحتوي على أرقام فقط",
    life: 3000,
  });
  return;
} else {
  // Valid input, proceed with further actions
}

  let result = null

   if (!props.disableValidation) {
    // Only validate if disableValidation is false
    result = await v$.value.$validate();
    console.log(props.disableValidation, result);
  }

  if (result) {
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: "تمت إضافة المرافق",
      life: 3000,
    });
    const newItem = {
      firstName: companion.firstName,
      lastName: companion.lastName,
      identityNo: companion.identityNo,
      identityType: companion.identityType,
      jobTitle: companion.jobTitle,
    };
    props.compList.push(newItem);
    resetForm()
    closeModal();
  }else
  toast.add({
    severity: "warn",
    summary: "فشل",
    detail: "لم يتم اضافة المرافق",
    life: 3000,
  });
};

const resetForm = () => {
  companion.firstName = "";
  companion.lastName = "";
  companion.identityType = null;
  companion.identityNo = "";
  companion.jobTitle = "";
};

const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
};
const closeModal = () => {
  displayModal.value = false;
};

type IdentityTypeOption = {
  value: number;
  text: string;
};
// Array of identity type options
const identityTypeOptions: IdentityTypeOption[] = [
  { value: 1, text: "اثبات هويه" },
  { value: 2, text: "جواز سفر" },
];

const getIdentityTypeLabel = (value: number) => {
  const identityType = identityTypeOptions.find(
    (option) => option.value === value
  );
  return identityType ? identityType.text : "";
};
</script>

<template>
  <Dialog
    header="اضافة مُرافق"
    contentStyle="height: 200px; padding: 20px;"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '60vw' }"
    :modal="true"
  >
    <form @submit.prevent="submitFormCom">

      <div class="grid p-fluid">
        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText
              id="firstName"
              type="text"
              v-model="companion.firstName"
            />
            <label for="firstName">الاسم </label>
            <!-- <div style="height: 2px">
              <span
                style="color: red; font-weight: bold; font-size: small"
                v-for="error in v$.firstName.$errors"
                :key="error.$uid"
                class="p-error"
              >
                {{ error.$message }}
              </span>
            </div> -->
          </span>
        </div>

        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText id="lastName" type="text" v-model="companion.lastName" />
            <label for="lastName">اللقب </label>
            <!-- <div style="height: 2px">
              <span
                style="color: red; font-weight: bold; font-size: small"
                v-for="error in v$.lastName.$errors"
                :key="error.$uid"
                class="p-error"
              >
                {{ error.$message }}
              </span>
            </div> -->
          </span>
        </div>

        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText id="jobTitle" type="text" v-model="companion.jobTitle" />
            <label for="jobTitle">صفة المرافق</label>
            <!-- <div style="height: 2px">
              <span
                style="color: red; font-weight: bold; font-size: small"
                v-for="error in v$.jobTitle.$errors"
                :key="error.$uid"
                class="p-error"
              >
                {{ error.$message }}
              </span>
            </div> -->
          </span>
        </div>

        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <Dropdown
              id="identityType"
              v-model="companion.identityType"
              placeholder="اختر نوع الاثبات"
              emptyMessage="لاتوجد انواع"
              :options="identityTypeOptions"
              optionValue="value"
              optionLabel="text"
            />
            <!-- <div style="height: 2px">
              <span
                style="color: red; font-weight: bold; font-size: small"
                v-for="error in v$.identityType.$errors"
                :key="error.$uid"
                class="p-error"
              >
                {{ error.$message }}
              </span>
            </div> -->
            <label for="identityType">نوع الاثبات</label>
          </span>
        </div>

        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText
              id="identityNo"
              type="text"
              v-model="companion.identityNo"
            />
            <label for="identityNo">رقم الاثبات</label>
            <!-- <div style="height: 2px">
              <span
                style="color: red; font-weight: bold; font-size: small"
                v-for="error in v$.identityNo.$errors"
                :key="error.$uid"
                class="p-error"
              >
                {{ error.$message }}
              </span>
            </div> -->
          </span>
        </div>
      </div>
    </form>
    <template #footer>
      <Button
        @click="submitFormCom"
        class="p-button-primry"
        icon="fa-solid fa-plus"
        label="إضافة"
        type="submit"
      />
      <Button
        @click="resetForm"
        icon="fa-solid fa-delete-left"
        label="مسح"
        class="p-button-danger"
        style="margin-right: 0.5rem"
      />
      <Toast position="bottom-left" />

      <!-- <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                  <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus /> -->
    </template>
  </Dialog>

  <Button
    @click="openModal"
    class="p-button-primary p-button-sm p-button-rounded"
    style="display: flex; justify-content: center; align-items: center; width: 6rem; "
    icon="fa-solid fa-plus"
    label=" مُرافق"
  >
  </Button>
  <ComapanionsDataTable :compList="props.compList" > </ComapanionsDataTable>
</template>
