<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'

</script>

<template>
      <SideBar/>
 
  <TopBar></TopBar>


</template>

<style>
.holy-grail {
    display: flex;
    flex-direction: column;
}

.holy-grail__main {
    flex-grow: 1;

    display: flex;
    flex-direction: row;
}

.holy-grail__left {
    width: 25%;
}

.holy-grail__middle {
    flex-grow: 1;
}

.holy-grail__right {
    width: 20%;
}
</style>
