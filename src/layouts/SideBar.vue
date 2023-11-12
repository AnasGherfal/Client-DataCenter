<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import Menu from "primevue/menu";
import { useRouter } from "vue-router";
const router = useRouter();
const authStore  = useAuthStore()
const items = ref([
  {
    label: "لوحة المعلومات",
    items: [
      {
        label: "الصفحة الرئيسية",
        icon: "fa-solid fa-house",
        command: () => {
          router.push("/");
        },      },
    ],
  },

  {
    label: "السجلات",
    items: [
      {
        label: "سجل العملاء",
        icon: "fa-solid fa-users",
        command: () => {
          router.push("/customersRecord");
        },
      },

      {
        label: "سجل الزيارات",
        icon: "fa-solid fa-book",
             command: () => {
          router.push("/VisitsRecords");
        },
      },

      {
        label: "سجل الاشتراكات",
        icon: "fa-solid fa-calculator",
        command: () => {
          router.push("/subscriptionsRecord");
        },      },
      {
        label: " مستخلصات مالية",
        icon: "fa-solid fa-receipt",
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
        command: () => {
          router.push("/AuditsRecord");
        },      },
    ],
  },

  {
    label: "اعدادات النظام",
    icon: "fa-solid fa-gear",
    to: "/SettingsView",
  },
]);

const permissions = ref([
  { name: "جميع الصلاحيات", value: 1 },
  { name: "ادارة العملاء", value: 2 },
  { name: "مسح عميل", value: 4 },
  { name: "ادارة الخدمات", value: 8 },
  { name: "مسح خدمه", value: 16 },
  { name: "ادارة الاشتركات", value: 32 },
  { name: "مسخ اشتراك", value: 64 },
  { name: "ادارة المرافقين", value: 128 },
  { name: "مسح مرافق", value: 256 },
]);


// Computed property to filter menu items based on user permissions
const filteredItems = computed(() => {
  return items.value.map((section) => {
    if (section.items) {
      section.items = section.items.filter((item) => {
        // Check if the user has the required permission to see the menu item
        return !('permission' in item) || hasPermission(item.permission);
      });
    }
    return section;
  });
});


// Function to check if the user has the required permission
function hasPermission(permissionValue:any) {
  return authStore.prem.includes(permissionValue);
}
</script>

<template>
  <Menu
    ref="menu"
    :model="filteredItems"
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
