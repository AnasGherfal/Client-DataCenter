<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import axios from 'axios';
import router from '@/router';
import type { Service } from './Models/ServicesModel';



const props = defineProps({
    service: {
        type: Object as () => Service,
        required: true
    },
    submitButtonText: {
        type: String,
        required: true
    },
    value: String

})// define opject
const instance = getCurrentInstance()

const service:Service= ref(props.service)

const onSubmitForm  = async () => {
    const result = await v$.value.$validate();
    try {
        if (result) {
            if (instance) {
                // Form submission logic here

                instance.emit('form-submit', service.value);
            }
        } else {
            toast.add({ severity: 'error', 
            summary: 'رسالة خطأ', 
            detail: 'يرجى تعبئة الحقول', 
            life: 3000 })
        }
    } catch (error) {
        console.log(error)

    }
}
// error msg for valid

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('ادخل اسم الباقة',required)},
    amountOfPower: {required: helpers.withMessage('يجب تعبئة هذا الحقل',required)},
    dns: {required: helpers.withMessage('يجب تعبئة هذا الحقل',required)},
    acpPort: {required: helpers.withMessage('يجب تعبئة هذا الحقل',required)},
    monthlyVisits: {required: helpers.withMessage('يجب تعبئة هذا الحقل',required)},
    price: {required: helpers.withMessage('يجب تعبئة هذا الحقل',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, service);

const resetForm = () => {
    service.name = '';
    service.acpPort= '';
    service.amountOfPower = '';
    service.dns= '';
    service.monthlyVisits=null;
    service.price=null;
    }


    
  

</script>


<template>
  <form @submit.prevent="onSubmitForm">

   <div class="grid p-fluid ">
    
    <div class="field col-12 md:col-4">
        <span class="p-float-label" >
            <InputText id="name" type="text" v-model="service.name"  />
            <label  for="name">اسم الباقة </label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="amountOfPower" type="text" v-model="service.amountOfPower" />
            <label for="amountOfPower" >Amount Of Power</label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.amountOfPower.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="acpPort" type="text" v-model="service.acpPort" />
            <label for="acpPort" >Acp Port</label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.acpPort.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label">
            <InputText id="monthlyVisits" type="text" v-model="service.monthlyVisits" />
            <label for="monthlyVisits" >عدد الزيارات في الشهر</label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.monthlyVisits.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
            
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="Dns" type="text" v-model="service.dns" />
            <label for="Dns" >Dns</label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.dns.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="price" type="text" v-model="service.price" />
            <label for="price" > سعر الباقة بالدينار</label>
            <div style="height: 10px;"> 
            <error  v-for="error in v$.price.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
            </div>
        </span>
    </div>

</div>

<Button  class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
<Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" style="margin-right: .5em;" />
<Toast position="bottom-left" />

</form>

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
transition-duration: 0.2s
}
.p-dialog {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  max-height: 90%;
  transform: scale(1);
  border-radius: 30px;
}


</style>