<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'
import ProFile from './components/Users/ProFile.vue'
</script>

<template>
    <div>
      <!-- Header -->
      <TopBar/>
    </div>
 
    <div style="width: 100%; margin-top: 75px;" class="absolute">

    <div style="width:28%; height: 100%; margin-right: 1%; position: absolute;">
        <SideBar/>
    </div> 

    <div style="width: 73%; margin-right: 26%; padding: 25px;">
      <!-- main -->
      <!-- <RouterView/> -->
  <ProFile/>
    </div>
    
    </div>

    <!-- Loading  -->
    <!-- <div id="loading">
  <img id="loading-image" src="./assets/logos/LTT-logo.png" height="40" alt="Loading..." />
</div> -->

</template>

<style >


body{
  padding:0;
  margin: 0;
  background-color: #f0efef;
  font-family:' bold',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: navy; 
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: gray; 
}


/* #loading {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.7;
  background-color: #fff;
  z-index: 99;
}

#loading-image {
  z-index: 100;
} */
</style>
