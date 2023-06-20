<script setup lang="ts">
import { FilterMatchMode } from "primevue/api";
import { onMounted, reactive, ref } from "vue";
import { useInvoicesStore } from "@/stores/invoices";
import { useCustomersStore } from "@/stores/customers";
import type { InvoiceResponde } from "@/Modules/Invoices/InvoicesRespondeModule";
import AddButton from "@/components/AddButton.vue";
import { invoiceApi } from "@/api/invoice";

const loading = ref(true);
const store = useInvoicesStore();
const customers = ref();
const filteredCustomer = ref();
const storeCustomers = useCustomersStore();
const startDate = ref(new Date());
const endDate = ref(new Date());

const invoice: InvoiceResponde = reactive({
  date: "2023-06-11T09:12:09.303Z",
  startDate: "",
  endDate: "",
  description: "",
  invoiceNo: "",
  subscriptionId: 0,
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const submitForm = async () => {};
const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...storeCustomers.customers];
    } else {
      filteredCustomer.value = storeCustomers.customers.filter(
        (users: { name: String }) => {
          return users.name.toLowerCase().startsWith(event.query.toLowerCase());
        }
      );
    }
  }, 250);
};

// Computed property to display the payment status
const getPaymentStatus = (isPaid: boolean) => {
  return isPaid ? "مدفوعه" : "غير مدفوعه";
};



const updateEndDate = () => {
  if (startDate.value > endDate.value) {
    endDate.value = startDate.value;
  }
};
function convertDateFormat(dateString: string | number | Date) {
  const date = new Date(dateString);
  
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

onMounted(async () => {
  try {
      const response = await invoiceApi.get();
      store.invoices = response.data.content;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }  });
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/invoices'">
    <Card>
      <template #title> سجل الفواتير 
        <AddButton
          name-button="إنشاء فاتورة"
          rout-name="/invoices/addInvoice"
        />
      </template>
      <template #content>
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
          :value="store.invoices"
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
            <form @submit.prevent="submitForm">
              <div class="grid p-fluid">
                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <AutoComplete
                      v-model="customers"
                      optionLabel="name"
                      :suggestions="filteredCustomer"
                      @complete="search"
                    />
                    <label for="customerName">العملاء</label>
                  </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <Calendar
                      inputId="startTime"
                      v-model="invoice.startDate"
                      dateFormat="yy/mm/dd"
                      :showTime="true"
                      selectionMode="single"
                      :minDate="startDate"
                      :showButtonBar="true"
                      :manualInput="true"
                      :stepMinute="5"
                      hourFormat="12"
                      @onChange="updateEndDate"
                    />
                    <label for="startTime">تاريخ بداية </label>
                  </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <Calendar
                      inputId="startTime"
                      v-model="invoice.endDate"
                      dateFormat="yy/mm/dd"
                      :showTime="true"
                      selectionMode="single"
                      :minDate="startDate"
                      :showButtonBar="true"
                      :manualInput="true"
                      :stepMinute="5"
                      hourFormat="12"
                      @onChange="updateEndDate"
                    />
                    <label for="startTime">تاريخ النهاية </label>
                  </span>
                </div>
              </div>
            </form>
          </template>
          <Column field="id" header="id " style="min-width: 12rem"></Column>
          <Column
            field="date"
            header="التاريخ"
            style="min-width: 12rem"
          ></Column>
          <Column
            field="description"
            header="وصف"
            style="min-width: 12rem"
          ></Column>
          <Column
            field="totalAmount"
            header="السعر"
            style="min-width: 8rem; direction: revert"
          >
            <template #body="slotProps">
              {{ slotProps.data.totalAmount }} دينار
            </template>
          </Column>
          <Column field="isPaid" header="الحاله" style="min-width: 8rem">
            <template #body="slotProps">
              <span :style="{ color: slotProps.data.isPaid ? 'green' : 'red' }">
                {{ getPaymentStatus(slotProps.data.isPaid) }}
              </span>
            </template>
          </Column>

          <Column style="min-width: 8rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.status !== 5"> </span>

              <RouterLink
                :to="'/invoices/invoicesDetails/' + slotProps.data.id"
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
