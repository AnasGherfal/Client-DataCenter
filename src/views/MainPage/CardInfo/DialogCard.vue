<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { toNumber } from "@vue/shared";
import moment from "moment";
import { FilterMatchMode } from "primevue/api";
import LockButton from "@/components/LockButton.vue";
import { subscriptionApi } from "@/api/subscriptions";
import { useSubscriptionsStore } from "@/stores/subscriptions";

const toast = useToast();
const dialog = ref(false);
const loading = ref(false);
const filteredSubs = ref();
const pageNumber = ref(1);
const pageSize = ref(5);
const currentPage = ref(0);
const totalPages = ref(1);

const statusSub = ref(0);
const props = defineProps<{
  stateCheck: number;
  iconShape: string;
}>();
const tab1 = ref();

async function filterdSubs() {
  subscriptionApi
    .getFiltered(pageNumber.value, pageSize.value, props.stateCheck)
    .then((response) => {
      console.log(response);
      filteredSubs.value = response.data.content;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
    });
  loading.value = false;
}

const toggleDialog = () => {
  dialog.value = true;
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([{ field: "serviceName", header: "الباقه" }]);
const selectedColumns = ref(columns.value);

const formatDate = (value: Date) => {
  return moment(value).format("yy/M/D  hh:mm a");
};

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case " مفعل":
      return "success";
    case " غير مفعل":
      return "danger";
    case " مقفل":
      return "danger";
  }
};
const status = (value: number) => {
  if (value === 1) {
    return " مفعل";
  } else if (value === 2) {
    return " غير مفعل";
  } else if (value === 5) return " مقفل";
};

const trans = (value: string) => {
  if (value == "1") return " مفعل";
  else if (value == "2") return " غير مفعل";
  else if (value == "5") return " مقفل";
};

const getDaysRemainingData = (endDate: Date) => {
  const now = moment();
  const end = moment(endDate);
  const daysRemaining = end.diff(now, "days");

  if (daysRemaining <= 0) {
    return { label: "منتهي", color: "red" };
  } else if (daysRemaining <= 30) {
    return { label: "قريباً من الانتهاء", color: "orange" };
  } else {
    return { label: "صالح", color: "green" };
  }
};

watch(filters, (newFilters) => {
  currentPage.value = 1; // Reset currentPage to the first page
  pageNumber.value = 1; // Reset pageNumber to 1
  filterdSubs();
});
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    filterdSubs();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    filterdSubs();
  }
};
</script>

<template>
  <div>
    <Toast />

    <Button
      type="button"
      :icon="iconShape"
      @click="toggleDialog(), filterdSubs()"
    />
    <Dialog
      :modal="true"
      v-model:visible="dialog"
      style="width: 50rem"
      :breakpoints="{ '600px': '100vw' }"
    >
      <Card>
        <template #title>
          <span v-if="props.stateCheck == 1"> سجل الاشتراكات الصالحة </span>
          <span v-else-if="props.stateCheck == 4">
            الاشتراكات المنتهية صلاحيتها</span
          >
          <span v-else-if="props.stateCheck == 5">
            الاشتراكات القريب انتهاء صلاحيتها
          </span>
          <AddButton
            name-button="إضافة اشتراك"
            rout-name="/subscriptionsRecord/addSubsciptions"
          />
        </template>
        <template #content>
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
            :value="filteredSubs"
            dataKey="id"
            :paginator="true"
            :rows="10"
            v-model:filters="filters"
            :globalFilterFields="['serviceName', 'customerName']"
            :rowsPerPageOptions="[5, 10, 25]"
            :pageLinkSize="totalPages"
            :currentPage="currentPage - 1"
            paginatorTemplate="  "
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
              header="اسم العميل"
              style="min-width: 8rem"
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
                  :value="status(data.status)"
                  :severity="getSeverity(data.status)"
                />
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                  v-model="filterModel.value"
                  @change="filterCallback()"
                  :options="['warning', '']"
                  placeholder="Select One"
                  class="p-column-filter"
                  style="min-width: 12rem"
                  :showClear="true"
                >
                  <template #option="slotProps">
                    <Tag
                      :value="slotProps.option"
                      :severity="slotProps.option"
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
              style="min-width: 3rem"
            >
            </Column>
            <Column
              field="daysRemaining"
              header="الصلاحية"
              style="min-width: 4rem"
            >
              <template #body="{ data }">
                <span
                  :style="{ color: getDaysRemainingData(data.endDate).color }"
                >
                  {{ getDaysRemainingData(data.endDate).label }}
                </span>
              </template>
            </Column>

            <Column
              field="startDate"
              header="تاريخ بداية الاشتراك"
              dataType="date"
              style="min-width: 11rem"
            >
              <template #body="{ data }">
                {{ formatDate(data.startDate) }}
              </template>
            </Column>

            <Column
              field="endDate"
              header="تاريخ نهاية الاشتراك"
              dataType="date"
              style="min-width: 12rem"
            >
              <template #body="{ data }">
                {{ formatDate(data.endDate) }}
              </template>
            </Column>

            <Column style="min-width: 2rem">
              <template #body="slotProps">
                <span v-if="slotProps.data.status !== 5">
                  <DeleteSubscription
                    :name="slotProps.data.id"
                    :id="slotProps.data.id"
                    type="Subscription"
                  >
                  </DeleteSubscription>
                </span>
                <!-- <LockButton
                typeLock="Subscription"
                :id="slotProps.data.id"
                :name="slotProps.data.id"
                :status="slotProps.data.status"
                @getdata="store.getSubs"
              /> -->

                <RouterLink
                  :key="slotProps.data.id"
                  :to="
                    '/subscriptionsRecord/SubscriptionsDetaView/' +
                    slotProps.data.id
                  "
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
          </DataTable>
        </template>
      </Card>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-button[data-v-a8d0e435] {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  height: 45px;
}
</style>
