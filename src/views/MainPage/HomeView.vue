

<script setup lang="ts">
import InfoList from './InfoList.vue'
import CardInfo from './CardInfo.vue';
import { useAuthStore } from '@/stores/auth';
import { useSharedStore } from '@/stores/shared';
const store = useAuthStore()

const sharedStore = useSharedStore()

</script>

<template>
    <CardInfo v-if="sharedStore.hasPermission([256], store.prem)"/>
    <InfoList/>
    <!-- <CallenderInfo/> -->
</template>