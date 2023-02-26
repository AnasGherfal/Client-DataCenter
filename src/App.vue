<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'

</script>

<template>



<div class="app">
    <SideBar/>
    <TopBar/>

    <RouterView/>

  </div>
</template>

<style >

button{
  cursor: pointer;
  background-color: transparent;
  border: 0;
  padding: 0;
  border:0;
  outline: 0;

}
.app{
  display:flex;
  position:fixed;

  height: 100%;
  width: 100%;
  background-color: #dbdded;

}


</style>
