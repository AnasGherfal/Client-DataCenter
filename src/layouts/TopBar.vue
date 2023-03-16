<script lang="ts" setup>
import IconGroup from './IconGroup.vue';
import Divider from 'primevue/divider';

import { ref } from 'vue';

</script>

<template>
    <div class=" scalein   animation-duration-1000
            	fixed
                z-5 
                flex 
                align-items-center 
                " style=" 
              -webkit-backdrop-filter: blur(5px);
              backdrop-filter: blur(5px);
               width: 100%;
                height:75px;
            	padding: 20px ;">





        <div>
            <img  alt="logo" src="../assets/pics/LTT-logo.png " height="40" style="margin-right:0px; --fa-animation-iteration-count:5" class="logo fa-bounce">
        </div>

        <div>
            <p style="font-size: 23px ;font-weight: 800;  width:257px; height:40px;">ليبيا للاتصالات والتقنية
            </p>
        </div>

        <Divider layout="vertical" />

        <!-- <IconGroup style="margin-right:calc(100% - 29rem);" /> -->
                <IconGroup style="margin-right: auto" />



    </div>
</template>

<style scoped>
.nav {
    text-align: end;
    background-color: rgb(247, 249, 255);

    width: 99%;
    height: 60px;
    position: absolute;
    z-index: 2;
}
p{
    
}

@media screen and (max-width: 400px) {
    p{
    display:none;
}
}

</style>