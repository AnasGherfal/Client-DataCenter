<script setup lang="ts">
import { ref } from 'vue';
import Knob from 'primevue/knob';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
const value = ref(30);

</script>


<template>
    <card>
       <template #title>
        بيانات الاشتراك
         <Divider/>
       </template> 
       
       <template #content>

        <div class="flex ">
            <div class="flex-1" style=" text-align: center;">
            <Knob :size="Card" v-model="value" readonly />
            <h2> الأيام المتبقية</h2>
            </div>
            <Divider class="p-divider-solid" layout="vertical" />
    
            <div class="flex-1"> 

           <h4 style="margin: 0;">اسم العميل</h4>
            <p style="margin: 0;">شركة Regest</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">Amount Of Power</h4>
            <p style="margin: 0;">28 امبير ,230 فولت رئيسية عدد 2</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">Acp Port</h4>
            <p style="margin: 0;">2</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">Dns</h4>
            <p style="margin: 0;">(rDNS&DNS)13</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">عدد الزيارات في الشهر</h4>
            <p style="margin: 0;">15 ساعة</p>

        </div>
    </div>

       </template>
       <template #footer>
    <div class="card">
        <TabView ref="tabview4" class="tabview-custom">
            <TabPanel>
                <template #header>
                    <i class="fa-solid fa-book mr-2"></i>
                    <span> سجل زيارات هده الخدمة </span>
                </template>
    <!-- سجل زيارات هده الخدمة -->
            </TabPanel>
            <TabPanel>
                <template #header>
                    <i class="fa-solid fa-circle-plus ml-2"></i>
                    <span>اضافة Acp Port</span>
                </template>
               <!-- Acp Poret الاضافية -->
            </TabPanel>
            <TabPanel>
                <template #header>
                    <i class="fa-solid fa-circle-plus mr-2"></i>
                    <span>اضافة DNS</span>
                </template>
                <!-- DNS الاضافية -->
            </TabPanel>
        </TabView>
    </div>
</template>
    </card>
</template>

<style>
.mr-2 {
  margin-left: 0.5rem !important;
}
</style>