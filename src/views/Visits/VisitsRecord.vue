<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import AddBotton from "@/components/AddButton.vue";
import { useVistisStore } from "@/stores/visits";
import { useToast } from "primevue/usetoast";
import DeleteVisit from "../../components/DeleteButton.vue";

const store = useVistisStore();
const loading = ref(true);
const toast = useToast();
const visitsDialog = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
  { field: "address", header: "تاريخ بداية الاشتراك" },
  { field: "phoneNumber1", header: "تاريخ انتهاء الاشتراك" },
  { field: "phoneNumber2", header: "الباقه" },
]);
const selectedColumns = ref(columns.value);

const rotName = ref();

function getId(index: {}) {
  rotName.value = index;
  console.log(rotName.value.name);
  visitsDialog.value = true;
}

// const deleteVisit = () => {
//   console.log(rotName.value);
//   axios
//     .delete("http://localhost:3000/visits/" + rotName.value.id)
//     .then((response) => {
//       console.log(response);
//       store.getdata();
//       toast.add({
//         severity: "success",
//         summary: "تم الحذف",
//         detail: response.data.msg,
//         life: 3000,
//       });
//       visitsDialog.value = false;
//     });
// };

</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/VisitsRecords'">
    <Card>
      <template #title>
        سجل الزيارات
        <AddBotton
          name-button="إنشاء زياره"
          rout-name="/visitsRecords/createVisit"
        />
      </template>
      <template #content>
        <DataTable
          :value="store.visits"
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
            field="customerName"
            header="اسم العميل "
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
          <Column
            field="price"
            header="السعر"
            style="min-width: 8rem"
          ></Column>

          <Column style="min-width: 8rem">

            <template #body="slotProps">
                <span v-if="slotProps.data.status !== 5">

                <DeleteVisit
                ></DeleteVisit>
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

<style></style>
