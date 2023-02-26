<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'

</script>

<template>
      <SideBar/>
 
  <TopBar></TopBar>


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
  position:absolute;
  height: 100%;
  width: 100%;
  background-color: #f4f5fa;

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
