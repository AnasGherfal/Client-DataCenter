<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import editPakage from './editPakage.vue';

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
    
    const deleteProductsDialog=false;

    function deleteProducts(){

        deleteProductsDialog=true;
    }
    
</script>


<template>
    <div class="grid"> 
        <div  v-for="servic in packagesList"
        :key="servic.id" class="col-12 md:col-6 lg:col-4" >
        <card>
        <template #header>
            <editPakage style="height: 25px; width: 25px;"
            />

            <Button style="height: 25px; width: 25px;float: left;"
             icon=" fa-solid fa-trash text-red-600"
             class=" mt-2 ml-2 p-button-secondary p-button-text" 
            v-tooltip="{value:'حدف الباقة', fitContent:true}" />
            <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
        </template>
            <template #content>

            <div style="height-min: 450px;" >  
    
                    <div class="justify-content-between ">
                         <div>
                        <span class="block text-center  text-3xl  font-bold">{{ servic.name }}</span>
                        <div class="text-center mb-3  ">عدد الزيارات المتاحة في هده الباقة في الشهر : {{ servic.monthlyVisits }}</div>
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