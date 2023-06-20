<script setup lang="ts">
import { ref, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useCustomersStore } from "@/stores/customers";
import { useToast } from "primevue/usetoast";
import AddBotton from "@/components/AddButton.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import DeleteCustomer from "../../components/DeleteButton.vue";

const toast = useToast();
const store = useCustomersStore();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const columns = ref([
  { field: "email", header: "البريد الإكتروني" },

  { field: "address", header: "العنوان" },
  { field: "primaryPhone", header: "رقم الهاتف (1)" },
]);
const selectedColumns = ref(columns.value);

const onToggle = (val: any) => {
  selectedColumns.value = columns.value.filter((col) => val.includes(col));
};

const statuses = ref([
  { value: 1, label: "نشط" },
  { value: 5, label: "مقفل" },
]);

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case "نشط":
      return "success";
    case "غير نشط":
      return "danger";
    case "مقفل":
      return "danger";
  }
};

const trans = (value: string) => {
  if (value == "1") return "نشط";
  else if (value == "2") return "غير نشط";
  else if (value == "5") return "مقفل";
};

const getSelectedStatusLabel = (value: any) => {
  const status = statuses.value.find((s) => s.value === value);
  return status ? status.label : "";
};

// Watch for changes in filters and trigger server-side search
watch(filters, (newFilters) => {
  store.currentPage = 1; // Reset currentPage to the first page
  store.pageNumber = 1; // Reset pageNumber to 1
  store.getCustomers();
});
const goToNextPage = () => {
  if (store.currentPage < store.totalPages) {
    store.currentPage += 1;
    store.pageNumber += 1; // Increment the pageNumber value
    store.loading = true;
    store.getCustomers();
  }
};

const goToPreviousPage = () => {
  if (store.currentPage > 1) {
    store.currentPage -= 1;
    store.pageNumber -= 1; // Decrement the pageNumber value
    store.loading = true;

    store.getCustomers();
  }
};
</script>

<template>
  <RouterView></RouterView>
  <div v-if="$route.path === '/customersRecord'">
    <Card>
      <template #title>
        سجل العملاء
        <AddBotton
          name-button="اضافة عميل"
          rout-name="/customersRecord/addCustomer"
        />
      </template>
      <template #content>
        <div>
          <div
            v-if="store.loading"
            class="border-round border-1 surface-border p-4 surface-card"
          >
            <div class="grid p-fluid">
              <div v-for="n in 9" class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <Skeleton width="100%" height="2rem"></Skeleton>
                </span>
              </div>
            </div>

            <Skeleton width="100%" height="100px"></Skeleton>
            <div class="flex justify-content-between mt-3">
              <Skeleton width="100%" height="2rem"></Skeleton>
            </div>
          </div>
          <DataTable
            v-else
            filterDisplay="row"
            ref="dt"
            :value="store.customers"
            dataKey="id"
            :paginator="true"
            :rows="10"
            v-model:filters="filters"
            :globalFilterFields="['name', 'status']"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="  عرض {first} الى {last} من {totalRecords} عميل"
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

            <template #header>
              <div class="grid p-fluid">
                <div class="field col-12 md:col-6 lg:col-4">
                  <div
                    class="table-header flex flex-column md:flex-row justiify-content-between"
                  >
                    <span class="p-input-icon-left p-float-label">
                      <i class="fa-solid fa-magnifying-glass" />
                      <InputText
                        v-model="filters['global'].value"
                        placeholder=""
                      />
                      <label for="search"> البحث </label>
                    </span>
                  </div>
                </div>

                <div class="field col-12 md:col-6 lg:col-4">
                  <MultiSelect
                    :modelValue="selectedColumns"
                    :options="columns"
                    optionLabel="header"
                    @update:modelValue="onToggle"
                    placeholder="حدد الأعمدة"
                  />
                </div>
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

            <Column field="id" header="ID" class="font-bold"></Column>

            <Column
              field="name"
              header="الإسم"
              style="min-width: 10rem"
              class="font-bold"
              frozen
            ></Column>

            <Column
              field="status"
              header="  الحاله "
              filterField="status"
              style="width: 2rem"
              :showFilterMenu="false"
              :filterMenuStyle="{ width: '4rem' }"
            >
              <template #body="{ data }">
                <Tag
                  :value="getSelectedStatusLabel(data.status)"
                  :severity="getSeverity(data.status)"
                />
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                  v-model="filterModel.value"
                  @change="filterCallback()"
                  :options="statuses"
                  optionLabel="label"
                  option-value="value"
                  placeholder="اختر الحالة"
                  class="p-column-filter"
                  style="min-width: 12rem"
                  :showClear="true"
                >
                  <template #option="slotProps">
                    <Tag
                      :value="slotProps.option.label"
                      :severity="getSeverity(slotProps.option.value)"
                    />
                  </template>
                </Dropdown>
              </template>
            </Column>
            <Column
              v-for="(col, index) of selectedColumns"
              :field="col.field"
              :header="col.header"
              :key="col.field + '_' + index"
              style="min-width: 10rem"
            ></Column>

            <Column style="min-width: 13rem">
              <template #body="slotProps">
                <span v-if="slotProps.data.status !== 5">
                  <DeleteCustomer
                    :name="slotProps.data.name"
                    :id="slotProps.data.id"
                    type="Customers"
                  >
                  </DeleteCustomer>
                </span>

                <RouterLink
                  :to="'customersRecord/CustomerProfile/' + slotProps.data.id"
                >
                  <Button
                    v-tooltip="{ value: 'البيانات الشخصية', fitContent: true }"
                    icon="fa-solid fa-user"
                    severity="info"
                    text
                    rounded
                    aria-label="Cancel"
                  />
                </RouterLink>

                <LockButton
                  typeLock="Customers"
                  :id="slotProps.data.id"
                  :name="slotProps.data.name"
                  :status="slotProps.data.status"
                  @getdata="store.getCustomers"
                />
              </template>
            </Column>
            <Toast position="bottom-left" />
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style>
.no-data-message p {
  font-size: 18px;
  font-weight: bold;
  color: #888;
}
.paginator-info {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
