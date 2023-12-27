<script setup lang="ts">
import { admin } from "../../api/admin";
import AddButton from "../../components/AddButton.vue";
import { useAdminStore } from "@/stores/admin";
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import LockButton from "@/components/LockButton.vue";
import DeleteAdmin from "../../components/DeleteButton.vue";

const store = useAdminStore();
const toast = useToast();

const rotName = ref();
const loading = ref(false);
const userDialog = ref(false);
function getId(index: {}) {
  rotName.value = index;
  userDialog.value = true;
}

onMounted(() => {
  store.getAdmins();
});

const statuses = ref([
  { value: true, label: "نشط" },
  { value: false, label: "غير نشط" },
]);

const trans = (value: boolean) => {
  if (value == true) return "نشط";
  else if (value == false) return "غير نشط";
};

const getSeverity = (status: any) => {
  switch (trans(status)) {
    case "نشط":
      return "success";
    case "غير نشط":
      return "danger";
  }
};
const getSelectedStatusLabel = (value: any) => {
  return trans(value);
};

const goToNextPage = () => {
  if (store.currentPage < store.totalPages) {
    store.currentPage += 1;
    store.pageNumber += 1; // Increment the pageNumber value
    store.loading = true;
    store.getAdmins();
  }
};

const goToPreviousPage = () => {
  if (store.currentPage > 1) {
    store.currentPage -= 1;
    store.pageNumber -= 1; // Decrement the pageNumber value
    store.loading = true;

    store.getAdmins();
  }
};

const deleteAdmin = (id: string) => {
  loading.value = true;
  admin
    .remove(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data.msg,
        life: 3000,
      });
      store.getAdmins();
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

function lockButton(id: string) {
  loading.value = true;

  admin
    .block(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
      store.getAdmins();
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
}

function unlockButton(id: string) {
  loading.value = true;

  admin
    .unblock(id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
      store.getAdmins();
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
}
</script>

<template>
  <RouterView></RouterView>

<div  v-if="$route.path === '/AdminsRecord'">    <card>
      <template #title>
        سجل المستخدمين
        <AddButton name-button="اضافة مستخدم" rout-name="/AdminsRecord/AddAdmin" />

        <Divider />
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
          ref="dt"
          :value="store.userData"
          dataKey="id"
          :paginator="true"
          :rows="5"
          paginatorTemplate=""
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل"
          responsiveLayout="scroll"
          :pageLinkSize="store.totalPages"
          :currentPage="store.currentPage - 1"
        >
        <template #paginatorstart >
          
          <span class="p-paginator-pages" style=" display: flex; justify-content: center; align-items: center; margin-top: 1rem;">
            <Button

            style="margin-left: 1rem; height: 2rem; width: 2rem;"
              icon="pi pi-angle-right"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="store.currentPage === 1"
              @click="goToPreviousPage"
            />
              الصفحة {{ store.currentPage }} من {{ store.totalPages }}

            <Button
            style="margin-right: 1rem; height: 2rem; width: 2rem;"

              icon="pi pi-angle-left"
              class="p-button-rounded p-button-primary p-paginator-element"
              :disabled="store.currentPage === store.totalPages"
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
            field="displayName"
            header="اسم المستخدم"
            style="min-width: 10rem"
            class="font-bold"
          ></Column>

          <Column
            field="isActive"
            header="  الحاله "
            filterField="status"
            style="width: 2rem"
            :showFilterMenu="false"
            :filterMenuStyle="{ width: '4rem' }"
          >
            <template #body="{ data }">
              <Tag
                :value="getSelectedStatusLabel(data.isActive)"
                :severity="getSeverity(data.isActive)"
              />
            </template>
            <!-- <template #filter="{ filterModel, filterCallback }">
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
            </template> -->
          </Column>

          <!-- <Column
            field="permissions"
            header="الاذونات"
            style="min-width: 7rem"
          ></Column> -->

          <Column
            field="email"
            header="البريد الإلكتروني"
            style="min-width: 10rem"
          ></Column>

          <Column style="min-width: 13rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.status !== 5">
                <DeleteAdmin
                  :name="slotProps.data.displayName"
                  :id="slotProps.data.id"
                  @submit="() => deleteAdmin(slotProps.data.id)"
                  type="User"
                >
                </DeleteAdmin>
              </span>
              <RouterLink
                :key="slotProps.data.id"
                :to="'/AdminsRecord/AdminsProfile/' + slotProps.data.id"
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
                typeLock="Admins"
                :id="slotProps.data.id"
                :name="slotProps.data.id"
                :status="slotProps.data.isActive"
                @getdata="() => store.getAdmins()"
                @submit="
                  () =>
                    slotProps.data.isActive
                      ? unlockButton(slotProps.data.id)
                      : lockButton(slotProps.data.id)
                "
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </card>
  </div>
</template>

<style>

</style>
