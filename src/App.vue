<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import SideBar from './components/SideBar.vue'
</script>

<template>

<div class="app">
    <SideBar/>
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
  position:absolute;
  height: fit-content;
  width: 100%;
  background-color: #f4f5fa;

}


</style>
