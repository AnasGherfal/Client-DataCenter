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



<Sidebar class="z-1" style="z-index: 2; position: absolute  ; background-color: brown;" :visible="true" :showCloseIcon	="false" :modal="false" position="right">
	Content
</Sidebar>

</div>
</template>

<style scoped>

div{
    background-color: red;
    position: absolute;
    z-index: 1;
}

</style>
