<script setup lang="ts">
import { admin } from "../../api/admin";
import AddButton from "../../components/AddButton.vue";
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { audit } from "@/api/audit";
import moment from "moment";

const data = ref();

const loading = ref();
const totalPages = ref(1);
const pageNumber = ref(1);
const pageSize = ref(10);
const currentPage = ref(0);

function convertToDate(dateString: string): string {
  const date = moment(dateString).format("YYYY/MM/DD | hh:mm A"); // Convert to string format
  return date;
}
onMounted(async () => {
  getAudits();
});

function getAudits() {
  audit
    .get(pageNumber.value, pageSize.value)
    .then(function (response) {
      console.log(response);
      data.value = response.data.content;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
      loading.value = false;
    })
    .catch(function (error) {
      console.log(error);
    });
}

const goToNextPage = () => {
  if (currentPage < totalPages) {
    currentPage.value += 1;
    pageNumber.value += 1; // Increment the pageNumber value
    loading.value = true;
    // getAdmins();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    pageNumber.value -= 1; // Decrement the pageNumber value
    loading.value = true;

    // getAdmins();
  }
};
</script>

<template>
  <card>
    <template #title>
      سجل الحركات

      <Divider />
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
        :value="data"
        dataKey="id"
        :paginator="true"
        :rows="5"
        paginatorTemplate=""
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل"
        responsiveLayout="scroll"
        :pageLinkSize="totalPages"
        :currentPage="currentPage - 1"
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
          field="type"
          header="الحركة"
          style="width: 2rem"
          class="font-bold"
        ></Column>

        <Column
          field="occuredOn"
          header="  حدث في "
          style="width: 4rem"
          :showFilterMenu="false"
        >
          <template #body="slotProps">
            {{ convertToDate(slotProps.data.occuredOn) }}
          </template>
        </Column>
      </DataTable>
    </template>
  </card>
</template>
