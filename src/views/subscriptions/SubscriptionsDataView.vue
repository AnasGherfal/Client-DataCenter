<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Knob from 'primevue/knob';
import axios, { toFormData } from 'axios';
import type { Service } from '../Services/Models/ServicesModelesModel';
import BackButton from '@/components/BackButton.vue';
import type { SubscriptionRespons } from './Models/SubscriptionsRespons';
import { useToast } from "primevue/usetoast";
import { useSubscriptionsStore } from '@/stores/subscriptions';


const prop=defineProps<{
nad:number
}>()


const store = useSubscriptionsStore();

const tab:SubscriptionRespons=reactive({
    id:null,
    status:null,
    serviceName:'' ,
    customerName: '' ,
    startDate:'',
    endDate:'',
    subscriptionFileId:null
  
})

const servobj:Service=reactive({
    id:null,
    name: '',
    amountOfPower: '',
    acpPort: '',
    dns: '',
    monthlyVisits: null,
    price: null,
  })

let date3:number ;

onMounted(async () => {
    await axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=10")
      .then(function (response) {
        console.log(prop.nad)
        tab.id  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].id;
        tab.status  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].status;
        tab.customerName  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].customerName;
        tab.endDate = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].endDate;
        tab.startDate  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].startDate;
        tab.serviceName  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].serviceName;
        tab.subscriptionFileId  = response.data.content.filter((id:{id:number}) => id.id == prop.nad)[0].subscriptionFileId;

        const date1 = new Date(tab.endDate);
        const date2 = new Date();
        date3 =Math.trunc( (date1.valueOf() - date2.valueOf())/24/60/60/1000)
        
      }).then(function() {  
        
        axios.get("https://localhost:7003/api/Service?PageNumber=1&PageSize=20")
      .then(function (response) {
        
        servobj.id= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].id;
        servobj.acpPort= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].acpPort;
        servobj.dns= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].dns;
        servobj.amountOfPower= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].amountOfPower;
        servobj.name= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].name;
        servobj.monthlyVisits= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].monthlyVisits;
        servobj.price= response.data.content.filter((servic:{name:string}) => servic.name === tab.serviceName)[0].price;
        console.log(servobj)

      })
      .catch(function (error) {
        console.log(error)
      })})
      .catch(function (error) {
        console.log(error)
      })

  })

  const customersDialog=ref(false)

const toast = useToast();

const renewalSubscription= () => {
    console.log(tab.id)
    axios.put('https://localhost:7003/api/Subscription/Renew?id=' + tab.id)
        .then(response => {
            console.log(response)
            customersDialog.value = false
            toast.add({ severity: 'success', summary: 'تم التجديد', detail: response.data.msg, life: 3000 });
            store.getSub();

          })
      .catch(function (error) {
        console.log(error)
      
        });
        }

        

</script>


<template>
    <card>
       <template #title>
       بيانات الاشتراك
 
     <BackButton style="float: left;" />

         <Divider/>
       </template> 
       
       <template #content>
        <div class="flex flex-row">
            <div class="flex-1" style=" text-align: center;">
            <Knob v-if="date3!=0" :size="Knob" v-model="date3" readonly :max="365" />
            <h3 v-if="date3"> الأيام المتبقية</h3>
            <h3 v-else class="text-red-800"> انتهت صلاحية هذه الخدمة هل تريد التجديد</h3>
            <h3 v-if="date3<30 && date3!=0" class="text-orange-600">قاربت الصلاحية على انتهاء هل تريد تجديد هذه الخدمة</h3>

            <Button v-if="date3<30" icon="fa-solid fa-arrows-rotate" severity="warning" text rounded aria-label="Cancel"  @click="customersDialog=true" />
                  <Dialog  v-model:visible="customersDialog" :style="{ width: '450px' }" header="تجديد الاشتراك"
                                    :modal="true">

                                    <div class="confirmation-content">
                                        <i class="fa-solid fa-arrows-rotate mr-3" style="font-size: 2rem; color: green;" />
                                        <span >هل انت متأكد من تجديد الاشتراك؟</span>
                                    </div>
                                    <template #footer>
                                        <Button label="لا" icon="pi pi-times" text @click="customersDialog = false" />
                                        <Button label="نعم" icon="pi pi-check" text @click="renewalSubscription" />
                                    </template>


                                </Dialog>     
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