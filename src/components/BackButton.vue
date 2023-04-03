<script setup lang="ts">
import router from '@/router';


function backButton() {
    router.go(-1)
}
</script>

<template>
    <Button @click="backButton" icon="fa-solid   fa-arrow-left fa-shake-hover" rounded aria-label="Filter" />
</template>