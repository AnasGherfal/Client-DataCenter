<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import type { Representatives } from "../../../../Modules/CustomerModule/RepresentativesModule/Representatives";
import { useRoute } from "vue-router";
import { toNumber } from "@vue/shared";
import RepresentativeForm from "./RepresentativeForm.vue";
import { representativesApi } from "@/api/representatives";
import { RepresentativeModel } from "../../../../Modules/Representatives/RepresentativesModel";
import Toast from "primevue/toast";
import DeleteButton from "@/components/DeleteButton.vue";
import LockButton from "@/components/LockButton.vue";
import EditRepresentatives from "./EditRepresentatives.vue";
import moment from "moment";
const route = useRoute();
const prop = defineProps<{
  customerStatus: number;
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

const loading = ref();
const totalPages = ref(1);
const pageNumber = ref(1);
const pageSize = ref(10);
const currentPage = ref(0);
const representativesById = ref();

const emit = defineEmits(["getRepresentatives"]);
const representatives = ref<Representatives>({
  id: "",
  firstName: "",
  lastName: "",
  identityNo: "",
  email: "",
  phoneNo: "",
  identityType: null, //1 personalId 2-authorized 3-representitive
  customerId: toNumber(userId.value),
  RepresentationDocument: null,
  IdentityDocuments: null,
  type: null,
  from: "",
  to: "",
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
  const typeAsInteger = parseInt(representative.type.value, 10);

  if (!isNaN(typeAsInteger)) {
    // Only append if the conversion was successful
    formData.append("type", typeAsInteger.toString());
  }
  formData.append("from", moment(representative.from).format("YYYY/MM/DD"));
  formData.append("to", moment(representative.to).format("YYYY/MM/DD"));

  formData.append(
    "identityType",
    representative.identityType?.toString() || ""
  );
  formData.append("IdentityDocument", representative.IdentityDocuments as Blob);
  formData.append(
    "RepresentationDocument",
    representative.RepresentationDocument as Blob
  );

  representativesApi
    .create(formData)
    .then((response) => {
      console.log(response);
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

const deleteRepresentative = (id: string) => {
  loading.value = true;

  representativesApi
    .remove(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data.msg,
        life: 3000,
      });
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.response.data.msg,
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
      emit("getRepresentatives");
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
const statuses = ref([
  { value: 1, label: "نشط" },
  { value: 2, label: "مقيد" },
]);

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case "نشط":
      return "success";

    case "مقيد":
      return "danger";
  }
};

const trans = (value: string) => {
  if (value == "1") return "نشط";
  else if (value == "2") return "مقيد";
};

const getSelectedStatusLabel = (value: any) => {
  const status = statuses.value.find((s) => s.value === value);
  return status ? status.label : "";
};

const goToNextPage = () => {
  if (currentPage < totalPages) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    emit("getRepresentatives");
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    emit("getRepresentatives");
  }
};
</script>

<template>
  <div style="display: flex; align-items: center">
    <Button
      @click="openModal"
      class="p-button-primary mb-4"
      style="display: flex"
      :disabled="prop.customerStatus == 2 || prop.representatives.length >= 2"
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

  <DataTable
    :value="prop.representatives"
    dataKey="id"
    :paginator="true"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 25]"
    paginatorTemplate="  "
  >
    <!-- <template #paginatorstart>
              <Button
                icon="pi pi-angle-right"
                class="p-button-rounded p-button-primary p-paginator-element"
                :disabled="currentPage === 1"
                @click="goToPreviousPage"
              />
              <span class="p-paginator-pages">
                الصفحة {{ currentPage }} من {{ totalPages }}
              </span>
            </template>
            <template #paginatorend>
              <Button
                icon="pi pi-angle-left"
                class="p-button-rounded p-button-primary p-paginator-element"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              />
            </template> -->

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
      field="firstName"
      header="اسم الاول"
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
      <template #body="{ data }">
        <Tag
          :value="getSelectedStatusLabel(data.status)"
          :severity="getSeverity(data.status)"
        />
      </template>
    </Column>

    <Column style="min-width: 11rem" header="الاجراءات">
      <template #body="slotProps">
        <span v-if="slotProps.data.status !== 2">
          <DeleteButton
            :name="slotProps.data.id"
            :id="slotProps.data.id"
            @submit="() => deleteRepresentative(slotProps.data.id)"
            type="Representative"
          >
          </DeleteButton>

          <EditRepresentatives
            :id="slotProps.data.id"
            :representatives="representativesById"
            @get-representatives="emit('getRepresentatives')"
          />
        </span>
        <LockButton
          typeLock="Representatives"
          :id="slotProps.data.id"
          :name="slotProps.data.id"
          :status="slotProps.data.status"
          @getdata="emit('getRepresentatives')"
        />
      </template>
    </Column>
  </DataTable>
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
