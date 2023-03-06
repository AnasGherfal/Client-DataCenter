<script setup lang="ts">
import InfoCustomer from './Profile Customer/InfoCustomer.vue'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
</script>

<template>
<InfoCustomer/>

<div class="bg-white shadow-2 p-3 mt-3 border-round-2xl" >

    <div class="card">
            <TabView class="tabview-custom" ref="tabview4">
                <TabPanel>
                    <template #header>
                        <i class="ml-2 pi pi-user"></i>
                        <span>المخولين</span>
                    </template>
                    <RouterView/>
                     <!-- المخولون الخاصون بالعميل -->
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <i class="ml-2 pi pi-calendar"></i>
                        <span>جدول الزيارات</span>
                    </template>
                                 <!-- الزيارات الخاصة بالعميل -->
                    </TabPanel>
                <TabPanel>
                    <template #header>
                        <i class="ml-2 pi pi-cog"></i>
                        <span>جدول الخدمات</span>
                        
                    </template>
                   <!-- الخدمات الخاصة بالعميل -->
                </TabPanel>
            </TabView>
        </div>
        </div>
</template>

<style>
   span{ font-family: 'Tajawal', sans-serif;}
</style>