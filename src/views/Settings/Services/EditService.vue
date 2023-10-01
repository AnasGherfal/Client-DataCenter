<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Service } from '../../../Modules/ServicesModule/ServicesModule';
import ServiceForm from "./serviceForm.vue";
import { serviceApi } from "../../../api/service";

const props = defineProps<{
  pakage: Service;
}>();
const emit = defineEmits(["getList"]);

const state: Service = reactive({
  id: props.pakage.id,
  name: props.pakage.name,
  amountOfPower: props.pakage.amountOfPower,
  acpPort: props.pakage.acpPort,
  dns: props.pakage.dns,
  monthlyVisits: props.pakage.monthlyVisits,
  price: props.pakage.price,
});

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

const onFormSubmit = async (state: Service) => {
  serviceApi
    .edit(props.pakage.id, state)
    .then((Response) => {
      emit("getList");
      toast.add({
        severity: "success",
        summary: "تم التعديل",
        detail: Response.data.msg,
        life: 3000,
      });
      displayModal.value = false;
    })
    .catch((e) => {
        toast.add({
        severity: "error",
        summary: "بم يتم التعديل",
        detail: e.data.msg,
        life: 3000,
      });    });
};

const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
  state.id= props.pakage.id,
  state.name= props.pakage.name,
  state.amountOfPower=props.pakage.amountOfPower,
  state.acpPort=props.pakage.acpPort,
  state.dns = props.pakage.dns,
  state.monthlyVisits = props.pakage.monthlyVisits,
  state.price = props.pakage.price;
};
const closeModal = () => {
  displayModal.value = false;
};
</script>

<template>
  <Dialog
    header="اضافة باقة"
    contentStyle="height: 250px; padding: 20px;"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '60vw' }"
    :modal="true"
    
  >
    <ServiceForm
      @form-submit="onFormSubmit"
      :service="state"
      :submitButtonText="'تعديل'"
      value="تعديل"
    />
  </Dialog>

  <Button
    @click="openModal"
    icon=" fa-solid fa-pen"
    class="mt-2 mr-2 p-button-primary p-button-text"
    v-tooltip="{ value: 'تعديل الباقة', fitContent: true }"
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

.p-dialog {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  max-height: 90%;
  transform: scale(1);
  border-radius: 30px;
}
</style>
