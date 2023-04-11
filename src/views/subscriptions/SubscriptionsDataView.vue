<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Knob from 'primevue/knob';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import axios, { toFormData } from 'axios';
import type { Service } from '../Services/ServicesModel';
import BackButton from '@/components/BackButton.vue';

const prop=defineProps<{
nad:number
}>()

const tab=ref({})
let date3:number 
onMounted(async () => {
    await axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=20")
      .then(function (response) {
        console.log(prop.nad)
        tab.value  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0];
        const date1 = new Date(tab.value.endDate);
        const date2 = new Date(tab.value.startDate);
        date3 =Math.trunc( (date1.valueOf()-date2.valueOf())/24/60/60/1000)

        console.log(date3)


      })
      .catch(function (error) {
        console.log(error)
      })

  })


  

  let servobj:Service=reactive({
    name: '',
    amountOfPower: '',
    acpPort: '',
    dns: '',
    monthlyVisits: 0,
    price: 0,
  })
  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Service?PageNumber=1&PageSize=10")
      .then(function (response) {

        console.log(tab.value.serviceName)
        console.log(response.data)
        
        servobj.acpPort= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].acpPort;
        servobj.dns= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].dns;
        servobj.amountOfPower= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].amountOfPower;
        servobj.name= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].name;
        servobj.monthlyVisits= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].monthlyVisits;
        servobj.price= response.data.content.filter((servic:{name:string}) => servic.name === tab.value.serviceName)[0].price;

        console.log(servobj)

      })
      .catch(function (error) {
        console.log(error)
      })

  })
//   console.log(deff)
  
//   const value = ref(deff);
const value=4.5
</script>


<template>
    <card>
       <template #title>
       
     رقم الاشتراك
     /         {{ nad }}
     <BackButton style="float: left;" />

         <Divider/>
       </template> 
       
       <template #content>
        <div class="flex flex-row">
            <div class="flex-1" style=" text-align: center;">
            <Knob :size="Knob" v-model="date3" readonly :max="365" />
            <h3> الأيام المتبقية</h3>
            </div>
            <Divider class="p-divider-solid" layout="vertical" />

            <div class="flex-1"> 

           <h4 style="margin: 0;">اسم العميل</h4>
            <p style="margin: 0;">{{ tab.customerName }}</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">Amount Of Power</h4>
            <p style="margin: 0;">{{ servobj.amountOfPower }}</p>
            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">Acp Port</h4>
            <p style="margin: 0;">{{ servobj.acpPort }}</p>

        </div>
        <Divider class="p-divider-solid" layout="vertical" />

        <div class="flex-1">
          
            <h4 style="margin: 0;">Dns</h4>
            <p style="margin: 0;">{{ servobj.dns }}</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">عدد الزيارات المتبقية في الشهر</h4>
            <p style="margin: 0;">30/{{ servobj.monthlyVisits }} ساعة</p>
        </div>
    </div>

       </template>
       
       <template #footer>
    <div class="card">
        <TabView ref="tabview4" class="tabview-custom">
            <TabPanel>
                <template #header>
                    <i class="fa-solid fa-book mr-2"></i>
                    <span> سجل زيارات هذا الاشتراك </span>
                </template>
    <!-- سجل زيارات هذه الخدمة -->
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