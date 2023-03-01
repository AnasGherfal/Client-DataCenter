<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
</script>

<template>
    <div>
      <!-- Header -->
      <TopBar/>
    </div>
 
    <div style="width: 100%; margin-top: 75px;" class="absolute">

    <div style="width:28%;height: 100%; margin-right: 1%; position: absolute;">
        <SideBar/>
    </div>

    <div style="width: 73%; margin-right: 26%; padding: 25px;">
      <!-- main -->
      <RouterView/>

    </div>
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

body{
  padding:0;
  margin: 0;
  background-color: #dfdfdf;
  font-family:'29LT Zawi bold',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}



</style>
