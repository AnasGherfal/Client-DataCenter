<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { admin } from "../../api/admin";
import { toNumber } from "@vue/shared";
import type { ResponseAdminModel } from "../../Modules/AdminModule/AdminModuleResponse";
import { useAdminStore } from "../../stores/admin";
import InfoAdmin from "./InfoAdmin.vue";

const route = useRoute();

const store = useAdminStore();
const isEditModeEnabled = ref(false);

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

function getAdminById() {
  admin
    .getById(userId.value)
    .then(function (response) {
      const filterdAdmins = response.data.content;
      Object.assign(adminData, filterdAdmins);
      // adminData.id = response.data.content.id;
      // adminData.displayName = response.data.content.displayName;
      // adminData.email = response.data.content.email;

      // adminData.isActive = response.data.content.isActive;
      // adminData.permissions = response.data.content.permissions;
    })
    .catch(function (error) {
      console.log(error);
    });
}
onMounted(async () => {
  getAdminById();
  getPermissions();
});

const avaliblePrem = ref<UserPermission[]>([]);

function getPermissions() {
  admin.permissions().then(function (response) {
    avaliblePrem.value = response.data.content;
    console.log(avaliblePrem.value);
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

const selectedPermissions = ref([]);

const editPermissions = () => {
  const totalPermissions = selectedPermissions.value.reduce((acc, id) => {
    // Sum the selected permission values or perform any other desired logic
    return acc + id;
  }, 0);

  // You can now use 'totalPermissions' as needed (e.g., send it to a server)
  console.log('Total Permissions:', totalPermissions);

  // Clear the selected permissions
  selectedPermissions.value = [];
};
// const togglePermission = (id) => {
//   if (!isEditModeEnabled.value) {
//     // Provide the required arguments to the hasPermission function
//     if (hasPermission(id,adminData.permissions)) {
//       adminData.permissions = adminData.permissions.filter((p) => p !== id);
//     } else {
//       adminData.permissions.push(id);
//     }
//   }
// };


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
          <h3>الصلاحيات:</h3>
          <Button
            @click="isEditModeEnabled = !isEditModeEnabled"
            icon=" fa-solid fa-pen"
            label="تعديل"
            text
            rounded
            class="p-button-primary p-button-text"
            v-tooltip.top="{
              value: 'تعديل البيانات الشخصية',
              fitContent: true,
            }"
          />
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>اسم الصلاحية</th>
                  <th>لديه اذن</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in avaliblePrem" :key="r.id">
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
                <td>
    </td>
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
