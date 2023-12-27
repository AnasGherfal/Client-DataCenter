<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import AddButton from "@/components/AddButton.vue";
import LockButton from "@/components/LockButton.vue";
import moment from "moment";
import DeleteSubscription from "../../components/DeleteButton.vue";
import { Subscription } from "@/Modules/SubscriptionModule/SubscriptionsRequestModule";
import { subscriptionApi } from "../../api/subscriptions";
import { useToast } from "primevue/usetoast";
import { onBeforeRouteUpdate } from "vue-router";
import { useSharedStore } from "@/stores/shared";

// optional

const toast = useToast();
const loading = ref(true);
const subscriptions = ref<any[]>([]);
  const totalPages = ref(1);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const currentPage = ref(0);
  const store = useSharedStore()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([{ field: "serviceName", header: "الباقه" }]);
const selectedColumns = ref(columns.value);


onBeforeRouteUpdate((to, from, next) => {
  getSubs();
  next();
});
onMounted(() => {
  getSubs();
});


function getSubs() {
    // if (status.value === undefined || status.value === null) {
    //   status.value = 0;
    // }
    subscriptionApi
      .getPages(pageNumber.value, pageSize.value)
      .then(function (response) {
        subscriptions.value = response.data.content;
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
  getSubs();
});
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    getSubs();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    getSubs();
  }
};

const toggleLock = async (subs: any) => {
  try {
    let response;
    if (subs.status == 1) response = await subscriptionApi.block(subs.id);
    if (subs.status == 2) response = await subscriptionApi.unblock(subs.id);

    toast.add({
      severity: "success",
      summary: "نجحة العملية",
      detail: response?.data.msg,
      life: 3000,
    });
    getSubs();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "حدث خطأ",
      detail: error.response.data.msg || "حدث خطأ",
      life: 3000,
    });
  }
};

const deleteSubs = (id: string) => {
  subscriptionApi
    .remove(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data.msg,
        life: 3000,
      });
      getSubs();
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.response.data.msg,
        life: 3000,
      });
    });
};
</script>

<template>
  <RouterView></RouterView>

<div v-if="$route.path === '/subscriptionsRecord'">    <Card>
      <template #title>
        سجل الاشتراكات
        <AddButton name-button="إضافة اشتراك" rout-name="/subscriptionsRecord/addSubsciptions" />
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
          :value="subscriptions"
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
              :disabled="currentPage ===totalPages"
              @click="goToNextPage"
            />
            </span>

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
                :value="store.getSelectedStatusLabel(data.status)"
                :severity="store.getSeverity(data.status)"
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
                  <Tag :value="slotProps.option" :severity="slotProps.option" />
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
            style="min-width: 11rem"
          >
            <template #body="{ data }">
              {{ formatDate(data.endDate) }}
            </template>
          </Column>

          <Column style="min-width: 11rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.status !== 5">
                <DeleteSubscription
                  :name="slotProps.data.id"
                  :id="slotProps.data.id"
                  @submit="() => deleteSubs(slotProps.data.id)"
                  type="Subscription"
                >
                </DeleteSubscription>
              </span>
              <LockButton
                typeLock="Subscriptions"
                :id="slotProps.data.id"
                :name="slotProps.data.id"
                :status="slotProps.data.status"
                @submit="() => toggleLock(slotProps.data)"
                @getdata="getSubs"
              />

              <RouterLink
                :key="slotProps.data.id"
                :to="'/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id"
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
  </div>
</template>

<style></style>
