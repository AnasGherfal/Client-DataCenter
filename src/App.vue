<script setup lang="ts">
import { RouterView } from "vue-router";
import Dashboard from "./Dashboard.vue";
import LoginPage from "./views/LoginPage.vue";
import { useAuthStore } from "./stores/auth";
const authorized = useAuthStore();
</script>

<template>
      <!-- <LoginPage v-if="!authorized.userData" /> -->
  <Dashboard/>
  
  <!-- <RouterView /> -->
</template>
