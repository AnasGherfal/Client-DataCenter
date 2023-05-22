<script setup lang="ts">
import { user } from "../../api/user";
import AddBotton from "../../components/AddButton.vue";
import { useUserStor } from "@/stores/user";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import LockButton from "@/components/LockButton.vue";

const store = useUserStor();
const toast = useToast();

const rotName = ref();
const loading = ref(false);
const userDialog = ref(false);
function getId(index: {}) {
  rotName.value = index;
  userDialog.value = true;
}

const deleteUser = () => {
  loading.value = true;

  user
    .remove(rotName.value.id)
    .then((response) => {
      store.getUser();
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data,
        life: 3000,
      });
      userDialog.value = false;
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};
const statuses = ref([
  { value: 1, label: "نشط" },
  { value: 5, label: "مقفل" },
]);

const trans = (value: string) => {
  if (value == "1") return "نشط";
  else if (value == "2") return "غير نشط";
  else if (value == "5") return "مقفل";
};

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
const getSelectedStatusLabel = (value:any) => {
  const status = statuses.value.find((s) => s.value === value);
  return status ? status.label : '';
};
</script>

<template>
  <RouterView></RouterView>

  <div v-if="$route.path === '/UsersRecord'">
    <card>
      <template #title>
        سجل المستخدمين
        <AddBotton name-button="اضافة عميل" rout-name="/UsersRecord/AddUser" />

        <Divider />
      </template>
      <template #content>
        <DataTable
          ref="dt"
          :value="store.userData"
          dataKey="id"
          :paginator="true"
          :rows="5"
          paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل"
          responsiveLayout="scroll"
        >
          <Column
            field="fullName"
            header="اسم الموظف"
            style="min-width: 10rem"
            class="font-bold"
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
            field="empId"
            header="الرقم الوظيفي"
            style="min-width: 7rem"
          ></Column>

          <Column
            field="email"
            header="البريد الإلكتروني"
            style="min-width: 10rem"
          ></Column>

          <Column style="min-width: 13rem">
            <template #body="slotProps">
      
              <span v-if="slotProps.data.status !== 5">
                <Button
                  v-tooltip="{ value: 'حذف', fitContent: true }"
                  icon="fa-solid fa-trash-can"
                  severity="danger"
                  text
                  rounded
                  aria-label="Cancel"
                  @click="getId(slotProps.data)"
                />
                <Dialog
                  v-model:visible="userDialog"
                  :style="{ width: '450px' }"
                  header="تأكيد"
                  :modal="true"
                >
                  <div class="confirmation-content">
                    <i
                      class="pi pi-exclamation-triangle mr-3"
                      style="font-size: 2rem; color: red"
                    />
                    <span v-if="rotName"
                      >هل انت متأكد من حذف <b>{{ rotName.name }}</b> ؟</span
                    >
                  </div>
                  <template #footer>
                    <Button
                      label="نعم"
                      icon="pi pi-check"
                      text
                      @click="deleteUser"
                      :loading="loading"
                    />
                    <Button
                      label="لا"
                      icon="pi pi-times"
                      text
                      @click="userDialog = false"
                    />
                  </template>
                </Dialog>
              </span>
              <RouterLink
                :key="slotProps.data.id"
                :to="'/UsersRecord/UsersProfile/' + slotProps.data.id"
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
              <LockButton
                typeLock="User"
                :id="slotProps.data.id"
                :name="slotProps.data.id"
                :status="slotProps.data.status"
                @getdata="store.getUser"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </card>
  </div>
</template>

<style></style>
