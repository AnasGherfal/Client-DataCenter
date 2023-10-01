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
  representativesLength: number;
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
  firstFile: {
    file: null,
    docType: 0,
  },
  secondFile: {
    file: null,
    docType: 0,
  },
});

const toast = useToast();


const onFormSubmit = async (representative: Representatives) => {
  const formData = new FormData();

  formData.append("firstName", representative.firstName);
  formData.append("lastName", representative.lastName);
  formData.append("identityNo", representative.identityNo);
  formData.append("email", representative.email);
  formData.append("phoneNo", representative.phoneNo);
  formData.append("identityType", representative.identityType?.toString() || "");
  formData.append("customerId", representative.customerId?.toString() || "");

  // Append the first file as FormFile
  if (representative.firstFile.file instanceof File) {
    formData.append(
      "FirstFile.File",
      representative.firstFile.file,
      representative.firstFile.file.name
    );
    formData.append("firstFile.DocType", representative.firstFile.docType.toString());

  }

  // Append the second file if needed
  if (representative.secondFile.file instanceof File) {
    formData.append("SecondFile.File", representative.secondFile.file, representative.secondFile.file.name);
    formData.append("SecondFile.DocType", representative.secondFile.docType.toString());
  }
  const formDataObject: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  console.log("formData:", formDataObject);
  representativesApi
    .create(formData)
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
      if (prop.representativesLength > 2) {
        toast.add({
          severity: "warn",
          summary: "هذا العميل لديه الحد الأقصى من عدد المخوليين",
          detail: error,
          life: 3000,
        });
      }
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
  representatives.value.firstFile.file = null;
  representatives.value.firstFile.docType = 0;
  representatives.value.secondFile.file = null;
  representatives.value.secondFile.docType = 0;


};
const displayModal = ref(false);
const openModal = () => {
  displayModal.value = true;
};
</script>

<template>
  <div style="display: flex; align-items: center;">
    <Button
      @click="openModal"
      class="p-button-primary mb-4"
      style="display: flex"
      :disabled="prop.customerStatus == 5 || prop.representativesLength >= 2"
    >
      اضافة مُخول
    </Button>
    <Dialog
      header="اضافة مُخول"
      contentStyle="max-height: 70vh; max-width: 40vw; min-width:50vw; padding: 10px;"
      v-model:visible="displayModal"
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
    <div v-if="prop.representativesLength >= 2" class="warning-message" style="margin-bottom: 1rem; margin-top: -1rem;">
      <div class="warning-message-icon"></div>
      <div class="warning-message-text">
        هذا العميل لديه الحد الأقصى من عدد المخوليين      </div>
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
