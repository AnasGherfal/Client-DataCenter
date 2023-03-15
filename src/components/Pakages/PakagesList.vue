<script setup lang="ts">
import axios from 'axios';
import Divider from 'primevue/divider';
import { onMounted, ref } from 'vue';

const packagesList=ref()
onMounted( async () =>{ 
    await axios.get("http://localhost:3000/services")
        .then((response) =>{
            packagesList.value = response.data;
            console.log(packagesList)
    })
    .catch(function(error){
        console.log(error)
      })
    })
    
</script>


<template>
    <div class="grid"> 
        <div  v-for="servic in packagesList"
        :key="servic.id" class="col-12 md:col-6 lg:col-4" >
        <card>
            <template #header>
            <Button style="height: 25px; width: 25px;" icon=" fa-solid fa-pen text-blue-800" class="absolute mt-2 mr-2 p-button-secondary p-button-text" />
        </template>
            <template #content>

            <div style="height-min: 450px;" >  
    
                    <div class="justify-content-between ">
                         <div>
                        <span class="block text-center  text-3xl  font-bold">{{ servic.name }}</span>
                        <div class="text-center mb-3  ">عدد الزيارات المتاحة في هده الباقة في الشهر : {{ servic.monthlyVistsShare }}</div>
                        <div class=" text-center font-semibold text-4xl">{{ servic.pricePerYear }}<span class="text-xs mr-1 text-blue-800">د.ل</span></div>
                    </div>
                    <Divider/>
                  
                </div>
                <p class="font-bold">خواص هده الباقة :</p>

                <div style="direction:ltr;" class="text-center font-bold text-sm"> 
                <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>  
                <span>(Acp Port): {{ servic.AcpPort }}</span>
                <span class=" font-medium"></span>
                </div>

                <div class="text-center font-semibold text-sm">   
                <span>DNS : {{ servic.Dns }}</span>
                <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
                <span class=" font-medium"></span>
                </div>

                

                <div style="direction:ltr;" class="text-center font-bold text-sm">   
                    <i class="text-green-600 fa-solid fa-circle-check mr-1"></i>
                <span> (Amount Of Power) : {{servic.amountOfPower}} </span>
                <span class="text-green-500 font-medium"></span>
                </div>

           


            </div>

        </template>
    </card>
    
    </div>
        </div>
        </template>



<style scoped>



</style>