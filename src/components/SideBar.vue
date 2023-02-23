<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';

import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';

const visibleRight = ref(true);

</script>

<template>

<div>
    
<Dialog>k</Dialog>



<Sidebar :visible="true" :showCloseIcon	="false" :modal="false" position="right">
	Content
</Sidebar>

</div>
</template>

<style scoped>

div{
    background-color: red;
}

</style>
