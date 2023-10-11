<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import AddButton from "@/components/AddButton.vue";
import { useVistisStore } from "@/stores/visits";
import { visitApi } from "@/api/visits";
import { formatTotalMin } from "@/tools/formatTime";
import moment from "moment";
import { useToast } from "primevue/usetoast";
import DeleteAdmin from "../../components/DeleteButton.vue";
import { customersApi } from "@/api/customers";
import { subscriptionApi } from "@/api/subscriptions";
import VisitStartPause from "./VisitStartPause.vue";
const toast = useToast();
const loading = ref(false);

const customers = ref();
const visits = ref();
const name = ref<string>("");
const customerSubscriptions = ref();
let customerId = ""
let subsId = ""
let subscriptionId = ""
const store = useVistisStore();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filteredCustomer = ref();



onMounted(async () => {
  getVisits(customerId, subscriptionId);
  getCustomers();
});

async function getVisits(customerId: string, subscriptionId:string) {
  try {
    console.log( subsId)
    const response = await visitApi.get(customerId, subscriptionId );
    visits.value = response.data.content;
  } catch (error) {
    console.log(error);
  } finally {
    store.loading = false;
  }
}

const search = (event: any) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCustomer.value = [...customers.value];
    } else {
      filteredCustomer.value = customers.value.filter(
        (users: { name: String }) => {
          return users.name.toLowerCase().startsWith(event.query.toLowerCase());
        }
      );
    }
  }, 250);
};

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

async function deleteVisit(id: string) {
  try {
    const response = await visitApi.remove(id);
    toast.add({
      severity: "success",
      summary: "رسالة نجاح",
      detail: `${response.data.msg}`,
      life: 3000,
    });
    store.getVisits();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "رسالة تحذير",
      detail: error.response.data.msg,
      life: 3000,
    });
  }
}

async function getCustomers() {
  await customersApi
    .get(1, 50, name.value)
    .then(function (response) {
      customers.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

const getSubscriptions = (id: string) => {
  subscriptionApi
    .get(1, 50, id)
    .then(function (response) {
      customerSubscriptions.value = response.data.content;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const customerselect = ref();

watch(customerselect, async (newValue) => {
   customerId = newValue.id;

  if (newValue && customerId !== undefined ) {
    try {
      loading.value = true;
      await getSubscriptions(customerId);
      loading.value = false;
    } catch (error) {
      console.error("Error fetching representatives:", error);
    }
  }
});

const statuses = ref([
  { value: "Not Started", label: "لم تبدأ" },
  { value: "In Progress", label: "بدأت" },
]);

// Declare the trans function before getSeverity
const trans = (value: any) => {
  if (value == "not Started") return "لم تبدأ";
  else if (value == "In Progress") return "بدأت";
};

const getSelectedStatusLabel = (value: any) => {
  const status = statuses.value.find((s) => s.value === value);
  return status ? status.label : "";
};

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case "بدأت":
      return "success";
    case "لم تبدأ":
      return "danger";
    default:
      return ""; // Return an empty string for other cases
  }
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        سجل الزيارات
        <AddButton name-button="إنشاء زياره" rout-name="/createVisit" />
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
          :value="visits"
          dataKey="id"
          ref="dt"
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
          <template #header>
            <div class="grid p-fluid mt-1">
              <div class="field col-12 md:col-6 lg:col-4">
                <div
                  class="table-header flex flex-column md:flex-row justiify-content-between"
                >
                  <span class="p-input-icon-left p-float-label">
                    <i class="fa-solid fa-magnifying-glass" />
                    <AutoComplete
                      v-model="customerselect"
                      optionLabel="name"
                      :suggestions="filteredCustomer"
                      @complete="search"
                    />
                    <label for="customerName">العملاء</label>
                  </span>
                </div>
              </div>

              <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                  <MultiSelect
                    v-model="subscriptionId"
                    :options="customerSubscriptions"
                    optionLabel="serviceName"
                    emptyMessage="هاذا العميل ليس لديه اشتراكات"
                    placeholder=" اختر اشتراك"
                    :selectionLimit="1"
                    :loading="loading"
                  />
                  <label for="customerName">اشتراكات</label>
                </span>
              </div>

              <div class="field col-12 md:col-6 lg:col-4">
                <Button label="بحث" @click="getVisits(customerId, subscriptionId)" />
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
          <Column
            field="customerName"
            header="اسم العميل "
            style="min-width: 8rem"
            class="font-bold"
            frozen
          ></Column>
          <Column
            field="visitType"
            header="سبب الزياره"
            style="min-width: 8rem"
            frozen
          >
            <template #body="{ data }">
              <Tag
                :value="
                  store.visitReasons && store.visitReasons[data.visitType - 1]
                    ? store.visitReasons[data.visitType - 1].name
                    : ''
                "
              >
              </Tag>
            </template>
          </Column>

          <Column
            field="totalMinutes"
            header="مدة الزيارة"
            style="min-width: 8rem"
          >
            <template #body="{ data }">
              {{
                data?.totalMinutes ? formatTotalMin(data.totalMinutes) : "- "
              }}
            </template>
          </Column>
          <Column
            field="price"
            header="السعر"
            style="min-width: 8rem; direction: revert"
          >
            <template #body="slotProps">
              {{ slotProps.data.price }} د.ل
            </template></Column
          >
          <Column field="visitStatus" header="الحاله" style="min-width: 1rem">
            <template #body="{ data }">
              <Tag
                :value="getSelectedStatusLabel(data.visitStatus)"
                :severity="getSeverity(data.visitStatus)"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }"> </template>
          </Column>
          <Column
            field="expectedStartTime"
            header="تاريخ بداية الزياره"
            style="min-width: 8rem"
            class="font-bold"
            frozen
          >
            <template #body="{ data }">
              {{ moment(data.expectedStartTime).format("YYYY-MM-DD HH:MM") }}
            </template></Column
          >
          <Column
            field="expectedEndTime"
            header="تاريخ انتهاء الزياره"
            style="min-width: 8rem"
            class="font-bold"
            frozen
          >
            <template #body="{ data }">
              {{ moment(data.expectedEndTime).format("YYYY-MM-DD HH:MM") }}
            </template>
          </Column>

          <Column style="min-width: 11rem">
            <template #body="slotProps">
              <DeleteAdmin
                :name="slotProps.data.customerName"
                :id="slotProps.data.id"
                @submit="() => deleteVisit(slotProps.data.id)"
                type="User"
              >
              </DeleteAdmin>
              <RouterLink
                :to="'/visitDetails/' + slotProps.data.id"
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

              <VisitStartPause
                :id="slotProps.data.id"
                :visitStatus="slotProps.data.visitStatus"
              />
            </template>
          </Column>
          <Toast position="bottom-left" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style></style>
