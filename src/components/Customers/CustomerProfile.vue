<script setup lang="ts">
import InfoCustomer from './Profile Customer/InfoCustomer.vue'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Authorized from './Authorized.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import router from '@/router';
import { RouterLink, routerKey } from 'vue-router';
import axios from "axios"
import { propsToAttrMap } from '@vue/shared';


const num= defineProps<{
    nameId: string
}>()
const tab= ref({})

onMounted(async () => {
    await axios.get("http://localhost:3000/users")
      .then(function (response) {
        tab.value = response.data.filter((users:{name:String}) => users.name === num.nameId)[0];

        console.log(tab)
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  console.log(typeof(tab))
//   const prof = tab

</script>

<template>    
<InfoCustomer
 :name="tab.name"
 :email1="tab.email"
 :address="tab.address"
 :phoneNumber1="tab.phoneNumber1"
 :phoneNumber2="tab.phoneNumber2" />
<div class="bg-white shadow-2 p-3 mt-3 border-round-2xl" >

    <div class="card">
            <TabView class="tabview-custom" ref="tabview4">
                <TabPanel>
                    <template #header>
                        <i class="ml-2 pi pi-user"></i>
                        <span>المخولين</span>
                    </template>
                     <!-- المخولون الخاصون بالعميل -->
                   <Authorized/>
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