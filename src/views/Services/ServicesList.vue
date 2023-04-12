<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import editservice from './EditService.vue';
import DeletService from './DeletService.vue';
import AddService from './AddService.vue';


const packagesList=ref()
onMounted( async () =>{ 
    await axios.get("https://localhost:7003/api/Service")
        .then((response) =>{
            packagesList.value = response.data.content;
    })
    .catch(function(error){
        console.log(error)
      })
    })

    function getList() {
        console.log("yes we dident")
      axios.get("https://localhost:7003/api/Service").then((resp) => {
        packagesList.value = resp.data.content;        
      });
    }

</script>


<template>
<div>
    <AddService @getList="getList" />

</div>
    <div class="grid" >
        <div  v-for="servic in packagesList"
        :key="servic.id" class="col-12 md:col-6 lg:col-4" >
        <card>
        <template  #header>
            <editservice :pakge="servic" @getList="getList" />

            <DeletService :pakge="servic" :key="servic.id" @getList="getList" />
        </template>
            <template #content>

            <div style="height-min: 450px;">  
    
                    <div class="justify-content-between ">
                         <div>
                        <span class="block text-center  text-3xl  font-bold">{{ servic.name }}</span>
                        <div class="text-center mb-3">عدد الزيارات المتاحة في هده الباقة في الشهر : {{ servic.monthlyVisits }}</div>
                        <div class=" text-center font-semibold text-4xl">{{ servic.price }}<span class="text-xs mr-1 text-blue-800">د.ل</span></div>
                    </div>
                    <Divider/>
                  
                </div>
                <p class="font-bold">خواص هده الباقة :</p>

                <div style="direction:ltr;" class="text-center font-bold text-sm"> 
                <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>  
                <span>(Acp Port): {{ servic.acpPort }}</span>
                <span class=" font-medium"></span>
                </div>

                <div class="text-center font-semibold text-sm">   
                <span>DNS : {{ servic.dns }}</span>
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