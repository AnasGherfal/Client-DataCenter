<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useRoute } from "vue-router";
import { toNumber } from "@vue/shared";
import RepresentativeForm from "./RepresentativeForm.vue";
import { representativesApi } from "@/api/representatives";
import { RepresentativeModel } from "../../../../Modules/Representatives/RepresentativesModel";
import Toast from "primevue/toast";

const route = useRoute();
const prop = defineProps<{
  customerStatus: number | undefined;
  CustomerId: string;
  representatives: RepresentativeModel[];
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
  RepresentationDocument: null,
  IdentityDocuments: null,
});

const toast = useToast();

const onFormSubmit = async (representative: Representatives) => {
  const formData = new FormData();

  formData.append("CustomerId", prop.CustomerId);
  formData.append("firstName", representative.firstName);
  formData.append("lastName", representative.lastName);
  formData.append("identityNo", representative.identityNo);
  formData.append("email", representative.email);
  formData.append("phoneNo", representative.phoneNo);
  formData.append(
    "identityType",
    representative.identityType?.toString() || ""
  );
  formData.append("IdentityDocument", representative.IdentityDocuments as Blob);
  formData.append("RepresentationDocument", representative.RepresentationDocument as Blob);

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
      toast.add({
        severity: "warn",
        summary: "رسالة تحذير",
        detail: error.response.data?.msg || "حدث خطأ ما",
        life: 3000,
      });
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
  representatives.value.RepresentationDocument = null;
  representatives.value.IdentityDocuments = null;
};
const displayModal = ref(false);
const openModal = () => {
  displayModal.value = true;
};
</script>

<template>
  <div style="display: flex; align-items: center">
    <Button
      @click="openModal"
      class="p-button-primary mb-4"
      style="display: flex"
      :disabled="prop.customerStatus == 5 || prop.representatives.length >= 2"
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

  <DataTable
    :value="prop.representatives"
    dataKey="id"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 25]"
    paginatorTemplate="  "
  >
    <template #header>
      <div class="grid p-fluid">
        <div class="field col-12 md:col-6 lg:col-4"></div>
      </div>
    </template>

    <template #empty>
      <div
        class="no-data-message"
        style="
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        "
      >
        <p style="font-size: 18px; font-weight: bold; color: #888">
          لا يوجد بيانات
        </p>
      </div>
    </template>

    <Column
      field="customerName"
      header="اسم المخول"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>
    <Column
      field="email"
      header="البريد الالكتروني"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>
    <Column
      field="firstName"
      header="الاسم الاول"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>
    <Column
      field="lastName"
      header="الاسم الاخير"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>
    <Column
      field="phoneNo"
      header="رقم الهاتف"
      style="min-width: 6rem"
      class="font-bold"
    ></Column>
    <Column
      field="status"
      header="  الحاله "
      filterField="status"
      style="width: 6rem"
      :showFilterMenu="false"
      :filterMenuStyle="{ width: '12rem' }"
    >
    </Column>

    <Column style="min-width: 11rem">
      <template #body="slotProps">
        <span v-if="slotProps.data.status !== 5">
          <DeleteSubscription
            :name="slotProps.data.id"
            :id="slotProps.data.id"
            type="Subscription"
          >
          </DeleteSubscription>
        </span>
        <LockButton
          typeLock="Subscription"
          :id="slotProps.data.id"
          :name="slotProps.data.id"
          :status="slotProps.data.status"
          @getdata="emit('getRepresentatives')"
        />

        
      </template>
    </Column>
  </DataTable>

  <div
    v-if="prop.representatives.length >= 2"
    class="warning-message"
    style="margin-bottom: 1rem; margin-top: -1rem"
  >
    <div class="warning-message-icon"></div>
    <div class="warning-message-text">
      هذا العميل لديه الحد الأقصى من عدد المخوليين
    </div>
  </div>

  <Toast />
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
