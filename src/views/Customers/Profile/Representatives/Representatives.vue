<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useRoute } from "vue-router";
import { toNumber } from "@vue/shared";
import RepresentativeForm from "./RepresentativeForm.vue";
import { representativesApi } from "@/api/representatives";

const route = useRoute();
const prop = defineProps<{
  customerStatus: number | undefined;
}>();
const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return route.params.id;
  } else {
    return null; // or return a default value if id is not available
  }
});

const emit = defineEmits(["getRepresentatives"]);
const representatives = ref<Representatives>({
  firstName: "",
  lastName: "",
  identityNo: "",
  email: "",
  phoneNo: "",
  identityType: null, //1 personalId 2-authorized 3-representitive
  customerId: toNumber(userId.value),
});

const toast = useToast();

const onFormSubmit = async (representative: Representatives) => {
  representativesApi
    .create(representative)
    .then((response) => {
      emit("getRepresentatives");
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 3000,
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      displayModal.value = false;
      resetForm();
    });
};

const resetForm = () => {
  representatives.value.firstName = "";
  representatives.value.lastName = "";
  representatives.value.email = "";
  representatives.value.phoneNo = "";
  representatives.value.identityNo = "";
  representatives.value.identityType = null;
};
const displayModal = ref(false);
const openModal = () => {
  displayModal.value = true;
};
</script>

<template>
  <div v-if="prop.customerStatus !== 5">
    <Button @click="openModal" class="p-button-primary mb-4">
      اضافة مُخول
    </Button>
    <Dialog
      header="اضافة مُخول"
      contentStyle="max-height: 80vh; max-width: 90vw; min-width:75vw; padding: 20px;"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :modal="true"
    >
      <template #default>
        <RepresentativeForm
          @form-submit="onFormSubmit"
          :representatives="representatives"
          :submitButtonText="'add'"
          value="اضافه"
        >
        </RepresentativeForm>
      </template>
    </Dialog>
  </div>
</template>

<style>
.p-card-title {
  text-align: right;
}

.p-inputtext {
  text-align: right;
  border-radius: 10px;
}

.p-inputtext-filled {
  text-align: right;
  align-items: end;
  align-content: end;
}
</style>
