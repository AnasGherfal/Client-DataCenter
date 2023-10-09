<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import AddButton from "@/components/AddButton.vue";
import { useVistisStore } from "@/stores/visits";
import { visitApi } from "@/api/visits";
import { formatTotalMin } from "@/tools/formatTime";
import moment from "moment";
import { useToast } from "primevue/usetoast";
import DeleteAdmin from "../../components/DeleteButton.vue";

const store = useVistisStore();
const toast = useToast();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  try {
    const response = await visitApi.get();
    store.visits = response.data.content;
  } catch (error) {
    console.log(error);
  } finally {
    store.loading = false;
  }
});

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
          :value="store.visits"
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
            <div class="grid p-fluid">
              <div class="field col-12 md:col-6 lg:col-4">
                <!-- <span class="p-input-icon-left p-float-label"> -->
                <!-- <i class="fa-solid fa-magnifying-glass" /> -->
                <!-- <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                  />
                  <label for="search" style="font-weight: lighter">
                    البحث
                  </label> -->
                <!-- </span> -->
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
          />

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
          <Column field="visitStatus" header="الحاله" style="min-width: 1rem" />

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
            </template>
          </Column>
          <Toast position="bottom-left" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style></style>
