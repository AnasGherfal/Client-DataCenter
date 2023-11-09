<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

const items = ref([
  {
    label: "لوحة المعلومات",
    items: [
      {
        label: "الصفحة الرئيسية",
        icon: "fa-solid fa-house",
        to: "/",
      },
    ],
  },

  {
    label: "السجلات",
    items: [
      {
        label: "سجل العملاء",
        icon: "fa-solid fa-users",
        to: "/customersRecord",
        key:"2",
        show: false
      },

      {
        label: "سجل الزيارات",
        icon: "fa-solid fa-book",
        to: "/VisitsRecords",
      },

      {
        label: "سجل الاشتراكات",
        icon: "fa-solid fa-calculator",
        to: "/subscriptionsRecord",
      },
      {
        label: " مستخلصات مالية",
        icon: "fa-solid fa-receipt",
        to: "/invoices",
      },
    ],
    
  },
  {
    label: "ادارة المشرفين",
    items: [
      {
        label: "سجل المشرفين",
        icon: "fa-solid fa-users-gear",
        to: "/AdminsRecord",
      },
      {
        label: "سجل الحركات",
        icon: "fa-solid fa-clock-rotate-left",
        to: "/AuditsRecord",
      },
    ],
  },

      {
        label: "اعدادات النظام",
        icon: "fa-solid fa-gear",
        to: "/SettingsView",
      },

]);

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

const store = useAuthStore()
console.log(store.userData)
// hasPermission(store)
const menu = ref();

const toggle = (event: any) => {
  menu.value.toggle(event);
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
  </Menu>

  <div>
    <Button
      style="display: none"
      class="SideBarbutton fixed"
      type="button"
      icon="fa-solid fa-bars"
      text
      aria-label="Filter"
      @click="toggle"
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