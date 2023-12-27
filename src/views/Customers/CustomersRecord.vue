<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useCustomersStore } from "@/stores/customers";
import { useToast } from "primevue/usetoast";
import AddButton from "@/components/AddButton.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import DeleteCustomer from "../../components/DeleteButton.vue";
import { Customer } from "@/Modules/CustomerModule/CustomersModule";
import { onBeforeRouteUpdate } from "vue-router";
const toast = useToast();
const customers = ref();
const loading = ref(true);
const totalPages = ref(1);
const pageNumber = ref(1);
const pageSize = ref(5);
const currentPage = ref(0);
const name = ref<string>("");
const store = useCustomersStore();
interface Filters {
  [key: string]: { value: string; matchMode: string };
}

const filters: Filters = reactive({
  global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  status: { value: "", matchMode: FilterMatchMode.EQUALS },
});

const columns = ref([
  { field: "email", header: "البريد الإكتروني" },
  { field: "primaryPhone", header: "رقم الهاتف" },

  { field: "address", header: "العنوان" },
]);
const selectedColumns = ref(columns.value);
// Add this section for beforeRouteEnter


const onToggle = (val: any) => {
  selectedColumns.value = columns.value.filter((col) => val.includes(col));
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

onBeforeRouteUpdate((to, from, next) => {
  getCustomers();
  next();
});

onMounted(async () => {
  getCustomers();
});
async function searchByName(searchName: string) {
  name.value = searchName;
  await getCustomers(); // Await the getCustomers function to wait for the API call to complete
}
async function getCustomers() {

  if (name.value === undefined || name.value === null) {
    name.value = "";
  }
  await customersApi
    .get(pageNumber.value, pageSize.value, name.value)
    .then(function (response) {
      customers.value = response.data.content;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

const toggleLockCustomer = async (customer: Customer) => {
  try {
    let response;
    if (customer.status === 1) {
      response = await customersApi.block(customer.id);
      customer.status = 2; // Update the status immediately
    } else if (customer.status === 2) {
      response = await customersApi.unblock(customer.id);
      customer.status = 1; // Update the status immediately
    }
    toast.add({
      severity: "success",
      summary: "نجحة العملية",
      detail: response?.data.msg,
      life: 3000,
    });
  

  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "حدث خطأ",
      detail: error.response.data.msg || "حدث خطأ",
      life: 3000,
    });
  } finally {
    getCustomers();
  }
};

const deleteCustomer = (id: string) => {
  loading.value = true;
  customersApi
    .remove(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data.msg,
        life: 3000,
      });
      getCustomers();
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
    });
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    getCustomers();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    getCustomers();
  }
};
// Function to handle the Enter key press and trigger the search
const onSearch = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    searchByName(name.value); // Call the searchByName function with the provided name
  }
};
</script>

<template>
    <RouterView></RouterView>

  <div  v-if="$route.path === '/customersRecord'">
    <Card>
      <template #title>
        سجل العملاء
        <AddButton @getCustomers="getCustomers" name-button="اضافة عميل"  rout-name="/customersRecord/addCustomer"
 />
      </template>
      <template #content>
        <div>
          <div
            v-if="loading"
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
            ref="dt"
            :value="customers"
            dataKey="id"
            :paginator="true"
            :rows="10"
            v-model:filters="filters"
            :globalFilterFields="['name', 'status']"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="  عرض {first} الى {last} من {totalRecords} عميل"
            :pageLinkSize="totalPages"
            :currentPage="currentPage - 1"
            paginatorTemplate="  "
          >
          <template #paginatorstart >
          
          <span class="p-paginator-pages" style=" display: flex; justify-content: center; align-items: center; margin-top: 1rem;">
            <Button

            style="margin-left: 1rem; height: 2rem; width: 2rem;"
              icon="pi pi-angle-right"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
            />
              الصفحة {{ currentPage }} من {{ totalPages }}

            <Button
            style="margin-right: 1rem; height: 2rem; width: 2rem;"

              icon="pi pi-angle-left"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="currentPage === totalPages"
              @click="goToNextPage"
            />
            </span>

        </template>

            <template #header>
              <div class="grid p-fluid mt-1">
                <div class="field col-12 md:col-6 lg:col-4">
                  <div
                    class="table-header flex flex-column md:flex-row justiify-content-between"
                  >
                    <span class="p-input-icon-left p-float-label">
                      <i class="fa-solid fa-magnifying-glass" />
                      <InputText
                        ref="searchInput"
                        v-model="name"
                        placeholder="البحث"
                        @keydown.enter="onSearch"
                      />
                      <label for="search" style="font-weight: lighter">
                        البحث
                      </label>
                    </span>
                  </div>
                </div>

                <!-- <div class="field col-12 md:col-6 lg:col-4">
                  <MultiSelect
                    :modelValue="selectedColumns"
                    :options="columns"
                    optionLabel="header"
                    @update:modelValue="onToggle"
                    placeholder="حدد الأعمدة"
                  />
                </div> -->
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

            <!-- <Column field="id" header="ID" class="font-bold"></Column> -->

            <Column
              field="name"
              header="الإسم"
              style="min-width: 6rem"
              class="font-bold"
              frozen
            ></Column>

            <Column
              field="status"
              header="  الحاله "
              filterField="status"
              style="width: 6rem"
              :showFilterMenu="false"
              :filterMenuStyle="{ width: '4rem' }"
            >
              <template #body="{ data }">
                <Tag
                  :value="getSelectedStatusLabel(data.status)"
                  :severity="getSeverity(data.status)"
                />
              </template>
              <template #filter="{ filterModel, filterCallback }"> </template>
            </Column>

            <Column
              v-for="(col, index) of selectedColumns"
              :field="col.field"
              :header="col.header"
              :key="col.field + '_' + index"
              style="min-width: 6rem"
            ></Column>

            <Column style="min-width: 11rem" header="  الاجراءات ">
              <template #body="slotProps">
                <span v-if="slotProps.data.status !== 2">
                  <DeleteCustomer
                    :name="slotProps.data.name"
                    :id="slotProps.data.id"
                    @submit="() => deleteCustomer(slotProps.data.id)"
                    type="Customers"
                  >
                  </DeleteCustomer>
                </span>

                <RouterLink :to="'customersRecord/CustomerProfile/' + slotProps.data.id">
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
                  @getdata="getCustomers"
                  @submit="() => toggleLockCustomer(slotProps.data)"
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
