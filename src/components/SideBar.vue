<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';


const contents =[]
const items=[
    {
        icon: 'pi pi-th-large',
        label: 'Home',
        to: '/',

    },
    {
        separator: true
    },
    {
        label: 'test',
        icon: 'pi pi-plus',
        to: '/about',
    }, {
        separator: true
    },
    {
        label: 'Named ',
        icon: 'pi pi-plus',
    },
    {
        label: 'test ',
        icon: 'pi pi-plus',
    },
]

</script>

<template>

<div>
    



<Sidebar class=" mt-3 mr-1 bg-blue-800 border-round  text-white font-bold flex align-items-center justify-content-center fadein animation-duration-1000"
 :visible="true" 
 :showCloseIcon	="false" 
 :modal="false" 
 position="right"
 >
 	ليبيا للإتصالات والتقنية

    <hr class="solid">

    
    <Menu style="text-align: center;" class="border-none w-full text-white "
     :model="items" ref="menu" :exact="true"  >
 

    </Menu>

</Sidebar>

</div>



</template>

<style scoped>
 

.p-menuitem-link, .p-menuitem		 {
  position: absolute;
  right: 0;
  color:red
}
.p-menuitem-icon	{
    position: absolute;
    right: 0;
    color:red
}
</style>
