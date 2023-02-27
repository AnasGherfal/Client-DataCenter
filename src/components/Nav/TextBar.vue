<template>
       <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText type="text" v-model="value3" placeholder="Search" />
        </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';

    const value3 = ref();
  
</script>