<script setup lang="ts">
import DialogCard from './CardInfo/DialogCard.vue';
</script>
<template>
    <div class="pp grid-container" style="display: grid;   grid-template-columns: auto auto auto;
" > 
        <Card style="height: 140px; width: auto;" class=" grid-item col-12 mr-1  lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-green-600 font-medium font-semibold">خدمات حالياً مفعلة</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-bolt" stateCheck="نشط"/>
                </div>
            </div>
       
            <div class="text-green-600 font-medium text-xl">47 خدمة</div>
      
            <span class="text-green-500 font-medium">.....</span>
            <span class="text-500">......</span>
        </template>
        </Card>
        <Card style="height: 140px; width: auto;" class=" grid-item col-12 mr-1  lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-orange-600 font-medium font-semibold">اقتراب انتهاء الصلاحية</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-bell" stateCheck="غير نشط"/>
                </div>
            </div>
       
            <div class="text-orange-600 font-medium text-xl">5 خدمات</div>
      
            <span class="text-orange-500 font-medium">.....</span>
            <span class="text-500">......</span>
        </template>
        </Card>
            <Card style="height: 140px; width: auto;" class="col-12  mr-1 lg:col-4 mb-3 p-3">
                <template #header>
            <div class="  border-round-2xl">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-red-600 font-medium font-semibold">خدمات غير مفعلة</span>
                    </div>
                       <DialogCard iconShape="fa-solid fa-circle-xmark" stateCheck="غير نشط"/>
                </div>
            </div>
       
            <div class="text-red-600 font-medium text-xl">47 خدمة</div>
      
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

