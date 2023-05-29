<script setup lang="ts">
import { FilterMatchMode } from "primevue/api";
import { ref } from "vue";
import { useInvoicesStore } from "@/stores/invoices";

const loading = ref(true);
const store = useInvoicesStore();


const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/invoices'">
    <Card>
      <template #title> سجل الفواتير </template>
      <template #content>
        <DataTable
          :value="store.Invoices"
          dataKey="id"
          filterDisplay="row"
          :globalFilterFields="['customerName', 'visitReason']"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} سجل الزيارات"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-input-icon-left p-float-label">
                  <i class="fa-solid fa-magnifying-glass" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                  />
                  <label for="search"> البحث </label>
                </span>
              </div>
            </div>
          </template>
          <Column
            field="subscriptionId"
            header=" "
            style="min-width: 12rem"
          ></Column>
          <Column
            field="visitType"
            header="سبب الزياره"
            style="min-width: 12rem"
          ></Column>
          <Column
            field="totalMin"
            header="مدة الزيارة"
            style="min-width: 12rem"
          ></Column>
          <Column field="totalAmount" header="السعر" style="min-width: 8rem"></Column>
          <Column field="isPaid" header="الحاله" style="min-width: 8rem"></Column>


          <Column style="min-width: 8rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.status !== 5">
                <DeleteVisit></DeleteVisit>
              </span>

              <RouterLink
                :to="'/visitsRecords/visitDetails/' + slotProps.data.id"
                style="text-decoration: none"
              >
                <Button
                  icon="fa-solid fa-circle-info"
                  severity="info"
                  text
                  rounded
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                />
              </RouterLink>
            </template>
          </Column>
          <Toast position="bottom-left" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>
