<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import MegaMenu from 'primevue/megamenu';

</script>

<template>
    <!-- <SideBar/> -->
    <div class="nav 
    z-5 
    relative 
    flex 
    align-items-center 
    justify-content-right 
    p-3 
    bg-blue-800 
    font-bold 
    text-blue-50  
    shadow-3
    " 
    style="width: 100%; height:75px;">
    <TopBar/>
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
  background-color: #b6c9d9;
  font-family: Arial, Helvetica, sans-serif;
  
}



</style>
