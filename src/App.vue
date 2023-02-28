<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import FirsPage from './components/FirstPage.vue'

</script>

<template>
    <div>
      <!-- Header -->
      <TopBar/>
    </div>
 
    <div style="width: 100%; margin-top: 75px;" class="absolute">

    <div style="width:25%;height: 100%; margin-left: 75%; position: absolute;">
        <SideBar/>
    </div>

    <div style="width: 75%; padding: 20px;">
      <!-- main -->
      <FirsPage/>
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
  font-family:'29LT Zawi Black',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}



</style>
