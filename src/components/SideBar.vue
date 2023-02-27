<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';


const contents =[]
const items=[
    {
        icon: ' pi pi-th-large',
        label: 'لوحة القيادة',
        to: '/',
        style: '',
        class: '    '

    },
    {
        separator: true
    },
    {
        icon: ' pi pi-th-large',
        label: 'لوحة القيادة',
        to: '/about',
        style: '',
        class: '    '

    },

]

</script>

<template>

<div>
    



<Sidebar class=" mt-5 h-30rem  mr-1  border-round  text-black font-bold flex align-items-center justify-content-center fadein animation-duration-1000"
 :visible="true" 
 :showCloseIcon	="false" 
 :modal="false" 
 position="right"
 >

    <hr class="solid">


    <Menu :model="items" 
    class=" menu  border-none w-full text-right  ">
     
    </Menu>
    
    

</Sidebar>

</div>



</template>

<style lang="scss">


    .p-menu-start{
        align-items: center;
    }
    .p-menuitem-text{
        


    }
    .p-menuitem-icon{
    }

    .p-menuitem{
     .router-link-active{
        background-color: rgb(55, 75, 179);
        border-radius: 30px;
        
    }
}

    

    // p-menuitem-link router-link-active router-link-active-exact
</style>



