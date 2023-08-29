<script setup lang="ts">
import { FilterMatchMode } from "primevue/api";
import { computed, onMounted, reactive, ref } from "vue";
import { useInvoicesStore } from "@/stores/invoices";
import { useCustomersStore } from "@/stores/customers";
import type { InvoiceResponde } from "@/Modules/Invoices/InvoicesRespondeModule";
import AddButton from "@/components/AddButton.vue";
import { invoiceApi } from "@/api/invoice";
import moment from "moment";
import DeleteInvoice from "../../components/DeleteButton.vue";
import { helpers, minValue, required, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const loading = ref(false);
const store = useInvoicesStore();

const storeCustomers = useCustomersStore();
// const startDate = ref(new Date());
// const endDate = ref(new Date());
const invoice = reactive({
    name: "",
    startDate: "",
    endDate: "",
  });
  const invoices = ref([]);
  const visits = ref();
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);
  // const name = ref("");
  // const startDate = ref("");
  // const endDate = ref("");
  const length = ref<number|null>(null)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const isEndDateRequired = () => {
  return !!invoice.startDate; // Return true if startDate has a value
};
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("الحقل مطلوب", required) },
    endDate: {
      requiredIf: helpers.withMessage(
        "الحقل مطلوب",
        requiredIf(() => invoice.startDate !== "")
      ),
      minValue: helpers.withMessage(
        "تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه",
        minValue(invoice.startDate)
      ),
      
    },
  };
});
const v$ = useVuelidate(rules, invoice);


onMounted(async () => {
    getInvoices();
  });
   function searchByDateAndName(
    searchName: string,
    serachStartDate: any,
    searchEndDate: any
  ) {
    invoice.name = searchName;
    invoice.startDate = serachStartDate;
    invoice.endDate = searchEndDate;
     getInvoices(); // Await the getCustomers function to wait for the API call to complete
  }

  function getInvoices() {
    loading.value = true;
    if (
      (invoice.startDate === undefined && invoice.endDate === undefined) ||
      (invoice.startDate === null && invoice.endDate == null)
    ) {
      invoice.startDate = "";
      invoice.endDate = "";
    }

    invoiceApi
      .get(
        pageNumber.value,
        pageSize.value,
        invoice.name,
        invoice.startDate,
        invoice.endDate
      )
      .then(function (response) {
        console.log(response);
        invoices.value = response.data.content;
        visits.value = response.data.content;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        loading.value = false;
      });
  }
// Computed property to display the payment status
const getPaymentStatus = (isPaid: boolean) => {
  return isPaid ? "مدفوعه" : "غير مدفوعه";
};

function convertToDate(dateString: string): string {
  const date = moment(dateString).format("YYYY/MM/DD | hh:mm A"); // Convert to string format
  return date;
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    getInvoices();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    getInvoices();
  }
};

// // Function to handle the Enter key press and trigger the search
// const onSearch = (event: KeyboardEvent) => {
//   if (event.key === "Enter") {
//     store.searchByName(store.invoice.name); // Call the searchByName function with the provided name
//   }
// };
function formatDateToYYYYMMDD(date: any) {
  // Get the date in the local time zone
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

const submitForm = async () => {
  invoice.name = invoice.name
  invoice.startDate = invoice.startDate;
  invoice.endDate = invoice.endDate;

  const result = await v$.value.$validate();
  if (result) {
    console.log(invoice.name, invoice.startDate, invoice.endDate)

    // Convert start and end dates to ISO string format
    if (invoice.startDate) {
      const startDate = new Date(invoice.startDate);
      invoice.startDate = formatDateToYYYYMMDD(startDate);
    }

    if (invoice.endDate) {
      const endDate = new Date(invoice.endDate);
      invoice.endDate = formatDateToYYYYMMDD(endDate);
    }

    searchByDateAndName(
      invoice.name,
      invoice.startDate,
      invoice.endDate
    );

  }
};
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/invoices'">
    <Card>
      <template #title>
        سجل الفواتير
        <AddButton
          name-button="إنشاء فاتورة"
          rout-name="/invoices/addInvoice"
        />
      </template>
      <template #content>
        <!-- <div
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
        </div> -->
        <DataTable
          :value="invoices"
          dataKey="id"
          filterDisplay="row"
          :globalFilterFields="['customerName', 'visitReason']"
          :paginator="true"
          :rows="10"
          :filters="filters"
          :pageLinkSize="totalPages"
          :currentPage="currentPage - 1"
          paginatorTemplate="  "
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="  عرض {first} الى {last} من {totalRecords} عميل"
          responsiveLayout="scroll"
        >
          <template #paginatorstart>
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
          </template>
          <template #header>
            <form @submit.prevent="submitForm">
              <div class="grid p-fluid mt-1">
                <div class="field col-12 md:col-6 lg:col-4">
                  <div
                    class="table-header flex flex-column md:flex-row justiify-content-between"
                  >
                    <span class="p-input-icon-left p-float-label">
                      <i class="fa-solid fa-magnifying-glass" />
                      <InputText
                        ref="searchInput"
                        v-model="invoice.name"
                        placeholder="البحث"
                      />
                      <label for="search" style="font-weight: lighter">
                        اسم العميل
                      </label>
                      <div style="height: 2px">
                        <span
                          style="
                            color: red;
                            font-weight: bold;
                            font-size: small;
                          "
                          v-for="error in v$.name.$errors"
                          :key="error.$uid"
                          class="p-error"
                        >
                          {{ error.$message }}</span
                        >
                      </div>
                    </span>
                  </div>
                </div>

                <div class="field col-12 md:col-6 lg:col-4">
                  <span class="p-float-label">
                    <Calendar
                      inputId="startTime"
                      v-model="invoice.startDate"
                      dateFormat="yy/mm/dd"
                      selectionMode="single"
                      :showButtonBar="true"
                      :manualInput="true"
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
                      selectionMode="single"
                      :showButtonBar="true"
                      :manualInput="true"
                    />
                    <label for="startTime">تاريخ النهاية </label>
                    <div style="height: 2px">
                      <span
                        style="color: red; font-weight: bold; font-size: small"
                        v-for="error in v$.endDate.$errors"
                        :key="error.$uid"
                        class="p-error"
                      >
                        {{ error.$message }}</span
                      >
                    </div>
                  </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                  <Button label="بحث" @click="submitForm" />
                </div>
              </div>
            </form>
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
              <p v-if="length == 0 " style="font-size: 18px; font-weight: bold; color: #888">
            اسم العميل مطلوب
              </p>
              <p v-else style="font-size: 18px; font-weight: bold; color: #888">
                لايوجد بيانات 
              </p>

            </div>
          </template>
          <Column
            field="customerName"
            header="اسم العميل"
            style="min-width: 8rem"
          ></Column>
          <Column field="date" header="التاريخ" style="min-width: 12rem">
            <template #body="slotProps">
              {{ convertToDate(slotProps.data.date) }}
            </template></Column
          >
          <Column
            field="description"
            header="وصف"
            style="min-width: 8rem"
          ></Column>
          <Column
            field="totalAmount"
            header="السعر"
            style="min-width: 8rem; direction: revert"
          >
            <template #body="slotProps">
              {{ slotProps.data.totalAmount }} د.ل
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
              <span v-if="slotProps.data.status !== 5">
                <DeleteInvoice
                  :name="slotProps.data.id"
                  :id="slotProps.data.id"
                  type="Invoices"
                >
                </DeleteInvoice>
              </span>
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
