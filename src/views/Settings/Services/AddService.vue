<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Service } from "../../../Modules/ServicesModule/ServicesModule";
import ServiceForm from "./serviceForm.vue";
import { serviceApi } from "../../../api/service";

const loading = ref(false);
const emit = defineEmits(["getList"]);
// define opject
const state: Service = reactive({
  id: null,
  name: "",
  amountOfPower: "",
  acpPort: "",
  dns: "",
  monthlyVisits: null,
  price: null,
});

// error msg for valid

const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("ادخل اسم الباقة", required) },
    amountOfPower: {
      required: helpers.withMessage("يجب تعبئة هذا الحقل", required),
    },
    dns: { required: helpers.withMessage("يجب تعبئة هذا الحقل", required) },
    acpPort: { required: helpers.withMessage("يجب تعبئة هذا الحقل", required) },
    monthlyVisits: {
      required: helpers.withMessage("يجب تعبئة هذا الحقل", required),
    },
    price: { required: helpers.withMessage("يجب تعبئة هذا الحقل", required) },
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, state);

const resetForm = () => {
  state.name = "";
  state.acpPort = "";
  state.amountOfPower = "";
  state.dns = "";
  state.monthlyVisits = null;
  state.price = null;
};

// submit form

const onFormSubmit = (state: Service) => {
    console.log(state)
  serviceApi
    .create(state)
    .then((response) => {
      loading.value = false;
      emit("getList");
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 3000,
      });
      displayModal.value = false;
      resetForm();
    })
    .catch((Response) => {
      toast.add({
        severity: "error",
        summary: "رسالة فشل",
        detail: Response.data,
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

// funcation for dialog

const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
};
</script>

<template>
  <Dialog
    header="اضافة باقة"
    contentStyle="height: 263px; padding: 20px;"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '60vw' }"
    :modal="true"
  >
    <template #default>
      <ServiceForm
        @form-submit="onFormSubmit"
        :service="state"
        :submitButtonText="'add'"
        value="اضافه"
        :loading="loading"
      />
    </template>
  </Dialog>
  <Button
    @click="openModal"
    style=""
    label="اضافة باقه"
    icon="fa-solid fa-plus "
    class="mb-4 ml-4 p-button-primry"
  />
</template>

<style>
error {
  font-size: 12px;
  font-weight: bold;
}

.p-dropdown {
  border-radius: 10px;
}
.p-float-label > label {
  right: 0.5rem;
  transition-duration: 0.2s;
}
.p-dialog {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  max-height: 90%;
  transform: scale(1);
  border-radius: 30px;
}
</style>
