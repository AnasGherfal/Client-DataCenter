<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';
import SideBar from './layouts/SideBar.vue'
import TopBar from './layouts/TopBar.vue'
import LoadingPage from './views/LoadingPage.vue';


const loading = ref(true);
onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500); // Set the timeout to the amount of time you want the loading page to display
    });


</script>

<template>

<LoadingPage v-if="loading"  />
  

  <main v-else>

      <TopBar/>
 
    <div style="width: 100%; margin-top: 75px;" class="absolute">

    <div style="width:28%; height: 100%; margin-right: 1%; position: absolute;">
        <SideBar/>
    </div> 

    <div class="content" style="transition: all 0.5s ease; width: 73%; margin-right: 26%; padding: 25px;">
      <!-- main -->

      <RouterView/>

      <!-- <ServiceInfo/> -->
  <!-- <CustomerProfile/> -->
  <!-- <VistProfile/> -->
  
    </div>
    
    </div>

</main>
</template>

<style>


@media screen and (max-width: 600px) {
    .content{
      width: 100% !important; margin-right: 0% !important;
    }
}


body{
  padding:0;
  margin: 0;
  background-color: var(--surface-ground);
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(22, 67, 160); 
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


