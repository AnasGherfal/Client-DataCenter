<script setup lang="ts">
import RepresentativeForm from "./RepresentativeForm.vue";
import { toNumber } from "@vue/shared";
import { computed, reactive, ref } from "vue";
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { representativesApi } from "@/api/representatives";

const props = defineProps<{
  name: any;
}>();
const emit = defineEmits(["getRepresentatives"]);

const route = useRoute();
const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});

const representatives: Representatives = reactive({
  firstName: props.name.firstName,
  lastName: props.name.lastName,
  identityNo: props.name.identityNo,
  email: props.name.email,
  phoneNo: props.name.phoneNo,
  identityType: props.name.identityNo, //1 personalId 2-authorized 3-representitive
  customerId: toNumber(userId.value),
});
const toast = useToast();

const onFormSubmit = async (representative: Representatives) => {

    representativesApi
    .edit(props.name.id, representative)
    .then((response) =>{

    emit("getRepresentatives");
    toast.add({
      severity: "success",
      summary: "Success Message",
      detail: response.data.msg,
      life: 3000,
    });
    displayModal.value = false;
  })     .catch((error) => {
      toast.add({
        severity: "warn",
        summary: "خطا",
        detail: error,
        life: 3000,
      });
})
}
const displayModal = ref(false);

const openModal = () => {
  displayModal.value = true;
};
const closeModal = () => {
  displayModal.value = false;
};
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
      contentStyle="max-height: 80vh; width: 75vw; padding: 20px;"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :modal="true"
    >
      <template #default>
        <RepresentativeForm
          @form-submit="onFormSubmit"
          :representatives="representatives"
          :submit-button-text="'Edit'"
          value="تعديل"
        >
        </RepresentativeForm>
      </template>
    </Dialog>
  </div>
</template>
