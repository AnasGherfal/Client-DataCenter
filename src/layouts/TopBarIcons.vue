<script setup lang="ts">
import router from "@/router";
import Button from "primevue/button";
import { ref } from "vue";
import {useSharedStore} from "@/stores/shared"
import { useAuthStore } from "@/stores/auth";
const menu = ref();
const sharedStore = useSharedStore();
const authStore = useAuthStore();

const items = ref([
  { separator: true },
  { label: "حساب تعريفي", icon: "fa-solid fa-user",
       command: () => {
          router.push("/adminProfile");
        },       },

  { separator: true },
]);

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const isDarkTheme = ref(false);

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/Login"; // Replace "/" with the actual home page URL
};
const toggleThemeMode = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const theme = isDarkTheme.value ? "dark" : "light";
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
};
</script>

<template>
  <div
    class="inline-flex fadeinleft animation-duration-1000"
    style="height: 30px; margin-top: -18px; margin-right: 12px"
  >
    <!-- <Button @click="toggleThemeMode"   style="height: 40px; width: 40px; --fa-animation-iteration-count: 2;"  class="m-1 p-button-text" 
            icon="fa-solid fa-moon fa-fade" /> -->

    <RouterLink to="/SettingsView" style="text-decoration: none">
      <Button
      v-if="sharedStore.hasPermission([4],authStore.prem)"
        style="height: 40px; width: 40px; --fa-animation-iteration-count: 1"
        icon="fa-solid fa-gear fa-spin fa-spin-hover"
        class="m-1 p-button-text transition-colors transition-duration-500"
        v-tooltip="{ value: 'اعدادات النظام', fitContent: true }"
      />
    </RouterLink>

    <Button
      @click="toggle"
      style="height: 40px; width: 40px; --fa-animation-iteration-count: 2"
      icon="fa-solid fa-ellipsis-vertical"
      class="m-1 p-button-text fa-bounce-hover"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      v-tooltip="{ value: 'قائمه', fitContent: true }"
    />
    <Menu ref="menu" :model="items" :popup="true">
      <template #start>
        <button
          @click=""
          class="w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround"
        >
          <span image="" class="mr-2" shape="circle" />
          <div class="flex flex-column align">
            <span class="font-bold">Admin</span>
          </div>
        </button>
      </template>
      <template #end>
        <!-- <ChangePasswordUser></ChangePasswordUser> -->

        <button
          @click="logout"
          class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
        >
          <i class="pi pi-sign-out" />
          <span class="ml-2">تسجيل الخروج</span>
        </button>
      </template>
    </Menu>
  </div>
</template>

<style scoped>
.ml-2 {
  margin-right: 0.5rem !important;
}
</style>
