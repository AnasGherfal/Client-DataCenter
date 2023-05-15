<script setup lang="ts">
defineProps<{
  routName: string;
  nameButton: string;
}>();
</script>

<template>
  <RouterLink :to="routName" style="text-decoration: none">
    <Button
      icon="fa-solid fa-plus"
      v-tooltip="{ value: nameButton, fitContent: true }"
      label=""
      rounded
      style="float: left"
      class="mr-2"
    >
    </Button>
  </RouterLink>
</template>
