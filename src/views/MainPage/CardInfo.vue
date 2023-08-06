<script setup lang="ts">
import DialogCard from './CardInfo/DialogCard.vue';
import Vue3autocounter from 'vue3-autocounter';

</script>
<template>
    <div class="pp grid-container" style="display: grid; gap: 1rem;   grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
" > 
        <Card style="height: 140px; width: auto;" class=" grid-item col-12 mr-1  lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-green-600 font-medium font-semibold">الاشتراكات الصالحة</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-check " stateCheck="1"/>
                </div>
            </div>

            <div class="text-green-600 font-medium text-xl">
                <Vue3autocounter ref='counter' :startAmount='0' :endAmount='500' :duration='3' prefix='' suffix=' اشتراك ' separator=',' decimalSeparator='' :decimals='0' :autoinit='true' />

            </div>
      
            <span class="text-green-500 font-medium">.....</span>
            <span class="text-500">......</span>
        </template>
        </Card>
        <Card style="height: 140px; width: auto;" class=" grid-item col-12 mr-1  lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-orange-600 font-medium font-semibold">الاشتراكات القريب انتهاء صلاحيتها</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-hourglass-half" stateCheck="2"/>
                </div>
            </div>
       
            <div class="text-orange-600 font-medium text-xl">
                <Vue3autocounter ref='counter' :startAmount='0' :endAmount='100' :duration='3' prefix='' suffix=' اشتراك ' separator=',' decimalSeparator='' :decimals='0' :autoinit='true' />

            </div>
      
            <span class="text-orange-500 font-medium">.....</span>
            <span class="text-500">......</span>
        </template>
        </Card>
            <Card style="height: 140px; width: auto;" class="col-12  mr-1 lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl" >
                <div class="flex justify-content-between mb-3" >
                    <div>
                        <span class="block text-red-600 font-medium font-semibold" >الاشتراكات المنتهية صلاحيتها</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-circle-xmark" stateCheck="2" />
                </div>
            </div>
       
            <div class="text-red-600 font-medium text-xl">
                <Vue3autocounter ref='counter' :startAmount='0' :endAmount='50' :duration='3' prefix='' suffix=' اشتراك ' separator=',' decimalSeparator='' :decimals='0' :autoinit='true' />

            </div>
      
            <span class="text-red-500 font-medium">.....</span>
            <span class="text-500">......</span>
        </template>

        </Card>
    </div>
</template>

<style>
@media screen and (max-width: 600px){

    .pp{
        display:block !important;
        

}
}

</style>

