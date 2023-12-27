<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import AddButton from "@/components/AddButton.vue";
import { useVistisStore } from "@/stores/visits";
import { useToast } from "primevue/usetoast";
import DeleteV from "../../components/DeleteButton.vue";
import LockButton from "@/components/LockButton.vue";
import { visitApi } from "@/api/visits";
import {formatTotalMin} from "@/tools/formatTime"

const store = useVistisStore();

const toast = useToast();
const visitsDialog = ref(false);

const props = defineProps<{
  visits: [];
}>();


const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
  { field: "address", header: "تاريخ بداية الاشتراك" },
  { field: "phoneNumber1", header: "تاريخ انتهاء الاشتراك" },
  { field: "phoneNumber2", header: "الباقه" },
]);
const selectedColumns = ref(columns.value);

const statuses = ref([
  { value: 1, label: "نشط" },
  { value: 5, label: "مقفل" },
]);

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case "نشط":
      return "success";
    case "مقفل":
      return "danger";
  }
};
const visitReasons = [
  { value: "7adbcf6d-e06f-410c-8a41-5857dadb0792", text: "صيانه" }, // Ensure the value is in quotes
  { value: "be05cdb1-03e4-4899-a910-662a79d8653e", text: "انهاء عمل" }, // Make sure other values are also strings if needed
];
const getVisitReasonText = (visitType: string) => {
  const visitReason = visitReasons.find(reason => reason.value === visitType);
  return visitReason ? visitReason.text : '';
};
const trans = (value: string) => {
  if (value == "1") return "نشط";
  else if (value == "5") return "مقفل";
};
const getSelectedStatusLabel = (value: any) => {
  const status = statuses.value.find((s) => s.value === value);
  return status ? status.label : "";
};
// onMounted(async () => {
//   try {
//     const response = await visitApi.get();
//     store.visits = response.data.content;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     store.loading = false;
//   }
// });

// Watch for changes in filters and trigger server-side search
watch(filters, (newFilters) => {
  store.currentPage = 1; // Reset currentPage to the first page
  store.pageNumber = 1; // Reset pageNumber to 1
  store.getVisits();
});
const goToNextPage = () => {
  if (store.currentPage < store.totalPages) {
    store.currentPage += 1;
    store.pageNumber += 1; // Increment the pageNumber value
    store.loading = true;
    store.getVisits();
  }
};

const goToPreviousPage = () => {
  if (store.currentPage > 1) {
    store.currentPage -= 1;
    store.pageNumber -= 1; // Decrement the pageNumber value
    store.loading = true;

    store.getVisits();
  }
};
</script>

<template> 

<DataTable
          :value="props.visits"
          dataKey="id"
          ref="dt"
          filterDisplay="row"
          :globalFilterFields="['customerName', 'visitReason']"
          :paginator="true"
          :rows="10"
          v-model:filters="filters"
          :pageLinkSize="store.totalPages"
          :currentPage="store.currentPage - 1"
          paginatorTemplate="  "
        >
          <template #paginatorstart>
            <Button
              icon="pi pi-angle-right"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="store.currentPage === 1"
              @click="goToPreviousPage"
            />
            <span class="p-paginator-pages">
              الصفحة {{ store.currentPage }} من {{ store.totalPages }}
            </span>
          </template>
          <template #paginatorend>
            <Button
              icon="pi pi-angle-left"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="store.currentPage === store.totalPages"
              @click="goToNextPage"
            />
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
            field="visitType"
            header="سبب الزياره"
            style="min-width: 8rem"
          >    <template #body="{ data }">
        {{ getVisitReasonText(data.visitType) }}
      </template></Column>
          <Column
            field="totalMin"
            header="مدة الزيارة"
            style="min-width: 8rem"
          >
          <template #body="{data}">
            {{ formatTotalMin(data.totalMin) }}
          
          </template>
        
        </Column>
          <Column field="price" header="السعر" style="min-width: 8rem"></Column>
          <Column field="status" header="الحاله" style="min-width: 1rem">
            <template #body="{ data }">
              <Tag
                :value="getSelectedStatusLabel(data.status)"
                :severity="getSeverity(data.status)"
              /> </template
          ></Column>


          <Toast position="bottom-left" />
        </DataTable>
  </template>