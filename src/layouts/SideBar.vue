<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";
import { admin } from "@/api/admin";
const router = useRouter();
const authStore  = useAuthStore()
const items = ref([
  {
    label: "لوحة المعلومات",
    items: [
      {
        label: "الصفحة الرئيسية",
        icon: "fa-solid fa-house",
        permission:0,
        command: () => {
          router.push("/");
        },  
         
         },
    ],
  },

  {
    label: "السجلات",
    items: [
      {
        label: "سجل العملاء",
        icon: "fa-solid fa-users",
        permission:1,
        command: () => {
          router.push("/customersRecord");
        },


      },

      {
        label: "سجل الزيارات",
        icon: "fa-solid fa-book",
        permission:2,

             command: () => {
          router.push("/VisitsRecords");
        },

      },

      {
        label: "سجل الاشتراكات",
        icon: "fa-solid fa-calculator",
        permission: 16,
        command: () => {
          router.push("/subscriptionsRecord");
        },      },
      {
        label: " مستخلصات مالية",
        icon: "fa-solid fa-receipt",
        permission:8,

        command: () => {
          router.push("/invoices");
        },      },
    ],
  },
  {
    label: "ادارة المشرفين",
    items: [
      {
        label: "سجل المشرفين",
        icon: "fa-solid fa-users-gear",
        command: () => {
          router.push("/AdminsRecord");
        },      },
      {
        label: "سجل الحركات",
        icon: "fa-solid fa-clock-rotate-left",
        permission: 511,
        command: () => {
          router.push("/AuditsRecord");
        },      },
    ],
  },
]);

//99ZUBV5K

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


const permissionsList = ref<UserPermission[]>([]);
  onMounted(async () => {
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

const fit:any=ref([]);
const hasPermission = (permissions: number[], permissionToCheck: number) => {
  // Iterate through each individual permission bit in permissionToCheck
  for (let i = 0; i < permissions.length; i++) {
    const permissionBit = permissions[i];
    // Check if the user has this specific permission bit
    if ((permissionToCheck & permissionBit) === permissionBit) {
      // for(const pp of items.value){
      // const foundItem= pp.items.find(item => item.permission === permissionBit);
      //   fit.value.push(foundItem);
      
      // items.value.forEach(item => item.items.forEach(item => item.permission) )
      
    return true; // User has this permission bit
    }
  }
  return false; // User doesn't have any of the specified permission bits
};



</script>

<template>
  <Menu
    ref="menu"
    :model="items"
    :popup="false"
    class="sidebar overflow-auto fixed mt-4 fadeinright animation-duration-500"
    style="border-radius: 15px; width: 20%; height: calc(100vh - 7.6rem)"
  >

                  <!-- <template #submenuheader="{ item }">
                <span class="text-primary font-bold">{{ item.label }}</span>
            </template> -->
                 <template  #item="{ item, props }" >

                    
                  <a v-if="hasPermission([item.permission], authStore.prem )" v-ripple class="flex align-items-center" v-bind="props.action">
                    
                    <span style="margin-left: 1rem;"  :class="item.icon" />
                    <span  class="">{{ item.label }}</span>
                </a>
            </template>
  </Menu>

  <div>
    <Button
      style="display: none"
      class="SideBarbutton fixed"
      type="button"
      icon="fa-solid fa-bars"
      text
      aria-label="Filter"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      v-tooltip="{ value: 'الشريط الجانبي', fitContent: true }"
    />

    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<style lang="scss">
.p-menuitem:hover {
  background-color: none !important;
}

.p-menuitem-content {
  margin: 10px;
}
.p-menuitem-text {
  color: var(--primary-color);

  margin-right: 5px;
  font-family: "Tajawal";
}

.p-submenu-header {
  font-family: "tajawal";
  font-weight: 800 !important;
}
.p-menuitem {
  .router-link-active {
    border-radius: 20px;
    border-color: #175deb46;
    border-style: solid;
    border-width: 3px;
  }
}
.p-menuitem-link:hover {
  border-radius: 20px;
}
.router-link-active {
  .p-menuitem-icon {
    color: var(--primary-color) !important;
  }
  .p-menuitem-text {
    font-weight: 600;
  }
}

.p-menu
  .p-menuitem:not(.p-highlight):not(.p-disabled)
  > .p-menuitem-content:hover {
  background-color: rgba(84, 118, 199, 0.386);
  border-radius: 20px;
}

.p-menu
  .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus
  > .p-menuitem-content {
  background-color: rgba(84, 118, 199, 0.386);
  border-radius: 20px;
}

@media screen and (max-width: 600px) {
  .sidebar {
    display: none;
  }
  .sidebar {
    display: none;
  }
  .SideBarbutton {
    display: inline !important;
    top: 60px;
  }
}

// class="p-menuitem-link router-link-active router-link-active-exact"
</style>
