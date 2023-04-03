<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import {useCounterStore} from '@/stores/counter'
import axios from 'axios';

import BackButton from '@/components/BackButton.vue';

const actEdit=ref(true);
const store = useCounterStore();

const dataClinet = defineProps<{
customer: any

}>()
  
  const state = dataClinet.customer 

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('الاسم مطلوب',required)},
    email: {required: helpers.withMessage('الايميل مطلوب',required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)},
    // address: {required: helpers.withMessage('العنوان مطلوب',required)},
    primaryPhone: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);



const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
    axios.put("https://localhost:7003/api/Customers/"+dataClinet.customer.id,state)
   .then(function(response) {
    console.log(response.data.msg)
    toast.add({severity:'success', summary: 'Success Message', detail:response.data.msg, life: 3000});
})
.catch(function(error){
   console.log(error)
   
 })
}else{
    console.log("empty")
}


        }



// const resetForm = () => {
//     state.name = '';
//     state.email = '';
//     state.primaryPhone = '';
//     state.secondaryPhone = '';
//     state.address = '';
//     state.File = '';


//         }

function focusname(){
    if(state.name){
     return true
    }
}






</script>


<template >
    <div>
        <Card >
            <template #title>
                <i class="fa-solid fa-user"></i>
                   البيانات الشخصية  

                   <BackButton style="float: left;"/>

                   <Button v-if="actEdit"  @click="actEdit=!actEdit"
             icon=" fa-solid fa-pen"
             style="width: 30px;height: 30px; margin-right: 10px;"
             class=" p-button-primary p-button-text"
             v-tooltip="{value:'تعديل البيانات الشخصية', fitContent:true}" />
             
                <Divider/>

            </template>
            <template #content>
                <div >


                     <div>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid " >
                    <div class="field col-12 md:col-6 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text" v-model="state.name" :disabled="actEdit" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="name">اسم </label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>

{{ dataClinet.customer }}
 
                   <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="email" type="text"  v-model="state.email" :disabled="actEdit" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="email">البريد الإلكتروني</label>
                            <error  v-for="error in v$.email.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="address" :value="address" type="text" v-model="state.address" :disabled="actEdit" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="address" >العنوان</label>
                            <!-- <error  v-for="error in v$.address.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error> -->

                        </span>
                    </div>

                    {{ state }}

                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id ="phoneNum1"  v-model="state.primaryPhone" :disabled="actEdit" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="phoneNum1">رقم هاتف </label>
                            <error  v-for="error in v$.primaryPhone.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="phoneNum2" :value="secondaryPhone" v-model="state.secondaryPhone"  :disabled="actEdit" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="phoneNum2">رقم هاتف 2</label>
                        </span>
                    </div>

                </div>

            </form>
        </div>

    <div v-if="!actEdit">
        <Button  @click="submitForm" icon="fa-solid fa-plus" label="تعديل" type="submit"  />

        <Button  @click="actEdit=!actEdit" icon="fa-solid fa-delete-left" label="إلغاء التعديل" class="p-button-danger" style="margin-right: .5em;" />
    </div>


        </div>
            </template>
            

        </Card>
        
    </div>
</template>


<style>
error{
    font-size: 12px; 
    font-weight: bold;
}

.p-dropdown	{
    border-radius: 10px;
}
.p-float-label > label{
right: 0.5rem;
transition-duration: 0.3s
}


.p-button:enabled:hover {
  background: #0d89ec;
  color: #ffffff;
  border-color: #0d89ec;
}




</style>