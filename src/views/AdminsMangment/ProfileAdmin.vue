<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { admin } from "../../api/admin";
import { toNumber } from "@vue/shared";
import type { ResponseAdminModel } from "../../Modules/AdminModule/AdminModuleResponse";
import { useAdminStore } from "../../stores/admin";
import InfoAdmin from "./InfoAdmin.vue";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const toast = useToast();

const store = useAdminStore();
const isEditModeEnabled = ref(false);
const loading = ref(false);
const selectedPermissions = ref<UserPermission[]>([]);
const permissionsList = ref<UserPermission[]>([]);

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return toNumber(route.params.id);
  } else {
    return null; // or return a default value if id is not available
  }
});

const adminData: ResponseAdminModel = reactive({
  id: "",
  displayName: "",
  email: "",
  permissions: 0,
  isActive: true,
  createdOn: "",
});

const permissions = ref([
  { name: "Customer Management", id: 1 },
  { name: "Visits Management", id: 2 },
  { name: "Service Management", id: 4 },
  { name: "Invoice Management", id: 8 },
  { name: "Subscription Management", id: 16 },
  { name: "Companion Management", id: 32 },
  { name: "Representative Management", id: 64 },
  { name: "Time Shift Management", id: 128 },
  { name: "Analytics Management", id: 256 },
  { name: "Super Admin", id: 511 },

]);

function getAdminById() {
  admin
    .getById(userId.value)
    .then(function (response) {
      adminData.id = response.data.content.id;
      adminData.displayName = response.data.content.displayName;
      adminData.email = response.data.content.email;
      adminData.isActive = response.data.content.isActive;
      adminData.permissions = response.data.content.permissions;
    })
    .catch(function (error) {
      console.log(error);
    });
}
onMounted(async () => {
  getAdminById();
  getPermissions();
});

function getPermissions() {
  admin.permissions().then(function (response) {
    permissionsList.value = response.data.content;
  });
}

interface UserPermission {
  id: number;
  name: string;
}
const hasPermission = (permissions: number[], permissionToCheck: number) => {
  // Iterate through each individual permission bit in permissionToCheck
  for (let i = 0; i < permissions.length; i++) {
    const permissionBit = permissions[i];
    // Check if the user has this specific permission bit
    if ((permissionToCheck & permissionBit) === permissionBit) {
      return true; // User has this permission bit
    }
  }
  return false; // User doesn't have any of the specified permission bits
};

watch(isEditModeEnabled, () => {
  if (isEditModeEnabled.value) {
    selectedPermissions.value = [];
    permissions.value.forEach((perm) => {
      if ((adminData.permissions & perm.id) === perm.id) {
        selectedPermissions.value.push(perm);
      }
    });
  }
});

const onEditPermissions = () => {
  loading.value = true;
  let perm = 0;
  if (selectedPermissions.value.some((p) => p.name === "Super Admin")) {
    perm =
      selectedPermissions.value.find((p) => p.name === "Super Admin")?.id || 0;
  } else {
    perm = selectedPermissions.value.reduce((sum, perm) => sum + perm.id, 0);
  }

  // update admin permissions
  admin
    .edit(userId.value, perm)
    .then(function (response) {
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 3000,
      });
      isEditModeEnabled.value = false;
      getAdminById();
    })
    .catch(function (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "رسالة فشل",
        detail: error.response.data.msg || "هنالك مشكلة في الوصول",
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <InfoAdmin
    :admin="adminData"
    :key="adminData.id"
    @getAdmins="store.getAdmins"
  />
  <card class="shadow-2 p-3 mt-3 border-round-2xl">
    <template #content>
      <TabView class="tabview-custom" ref="tabview4">
        <TabPanel>
          <template #header>
            <i class="fa-solid fa-key ml-2"></i>
            <span>الصلاحيات</span>
          </template>
          <div class="flex align-items-center justify-content-between">
            <h3>الصلاحيات:</h3>
            <Button
              @click="isEditModeEnabled = !isEditModeEnabled"
              icon=" fa-solid fa-pen"
              label="تعديل"
              text
              rounded
              class="p-button-primary p-button-text"
              v-tooltip.top="{
                value: 'تعديل صلاحيات المستخدم',
                fitContent: true,
              }"
            />
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>اسم الصلاحية</th>
                  <th>لديه اذن</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in permissionsList" :key="r.id">
                  <template
                    v-if="r.name !== 'None' && r.name !== 'Super Admin'"
                  >
                    <td>{{ r.name }}</td>
                    <td v-if="hasPermission([r.id], adminData.permissions)">
                      <button
                        :disabled="isEditModeEnabled"
                        style="background: none; border: none; cursor: pointer"
                      >
                        <i
                          class="fa-regular fa-circle-check"
                          style="color: #2cbd0f"
                        ></i>
                      </button>
                    </td>
                    <td v-else>
                      <button
                        :disabled="isEditModeEnabled"
                        style="background: none; border: none; cursor: pointer"
                      >
                        <i
                          class="fa-regular fa-circle-xmark"
                          style="color: red"
                        ></i>
                      </button>
                    </td>
                  </template>
                </tr>
                <td></td>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fa-solid fa-bars ml-2"></i>
            <span>سجل الحركات</span>
          </template>
          <!-- الخدمات الخاصة بالعميل -->
        </TabPanel>
      </TabView>
    </template>
  </card>

  <Dialog
    :modal="true"
    v-model:visible="isEditModeEnabled"
    style="width: 50rem"
    header="تعديل صلاحيات المستخدم"
    :breakpoints="{ '600px': '100vw' }"
  >
    <div>
      <MultiSelect
        v-model="selectedPermissions"
        display="chip"
        :options="permissions"
        optionLabel="name"
        placeholder="اختر الصلاحيات"
      />
    </div>
    <div class="flex items-center gap-3 mt-5">
      <Button
        class="p-button-primry"
        label="تعديل"
        type="submit"
        @click="onEditPermissions"
        :loading="loading"
      />
      <Button
        @click="isEditModeEnabled = false"
        label="الغاء"
        class="p-button-danger"
      />
    </div>
  </Dialog>
</template>

<style>
.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

.fa-regular {
  font-size: 20px;
}
</style>
