<script setup lang="ts">
import DialogCard from './CardInfo/DialogCard.vue';
</script>
<template>
    <div class="grid"> 
        <div class="col-12 md:col-6 lg:col-4">
            <div class="bg-green-50 shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-green-700 font-medium mb-3">خدمات حالياً مفعلة</span>
                        <div class="text-green-700 font-medium text-xl">47 خدمة</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-500 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-bolt text-green-50 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">.....</span>
                <span class="text-500">......</span>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <div class="bg-orange-50 shadow-2 p-3 border-round">
                <div class="flex  justify-content-between mb-3 ">
                    <div>
                        <span class="block text-orange-600 font-medium mb-3">اقتراب انتهاء الصلاحية</span>
                        <div class="text-orange-600 font-medium text-xl">5 خدمات</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-500 border-round" style="width:2.5rem;height:2.5rem">
                        <i  class="pi pi-history text-green-50 text-xl"></i>
                    </div>
                </div>
                <span class="text-600 ">اقل من شهر على انتهاء الخدمة</span>
            </div>
        </div>
        <div class="col-12 md:col-6 lg:col-4">
            <div class="bg-red-50 shadow-2 p-3 border-round">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-red-600 font-medium mb-3">خدمات غير مفعلة</span>
                        <div class="text-red-600 font-medium text-xl">47 خدمة</div>
                    </div>
                       <DialogCard/>
                </div>
                <span class="text-red-500 font-medium">.....</span>
                <span class="text-500">......</span>
            </div>
        </div>
    </div>
</template>

