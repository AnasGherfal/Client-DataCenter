<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import axios from 'axios';
import router from '@/router';
import type { Service } from './ServicesModel';



const emit=defineEmits(['getList'])
// define opject
const state:Service= reactive({
    name: '',
    amountOfPower: '',
    acpPort: '',
    dns: '',
    monthlyVisits: null,
    price: null,
})

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

const v$ = useVuelidate(rules, state);

const resetForm = () => {
    state.name = '';
    state.acpPort= '';
    state.amountOfPower = '';
    state.dns= '';
    state.monthlyVisits=null;
    state.price=null;
    }

// submit form 

    const submitForm = async () => {
    const result = await v$.value.$validate();
    console.log(state)

    if (result) {
        axios.post("https://localhost:7003/api/Service", state)
            .then(function (response) {
                emit('getList')
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة باقة', life: 3000 });
            })
            .catch(function (error) {
                console.log(error)
                toast.add({ severity: 'warn', summary:'هناك مشكلة في عملية الادخال', detail:error , life: 3000 });
            })
            displayModal.value = false;
            resetForm();
            

    } else {
        console.log("empty")
        toast.add({ severity: 'warn', summary:'هناك مشكلة في عملية الادخال' , life: 3000 });

    }
} 
  
// funcation for dialog  

const displayModal = ref(false);

const openModal = () => {
            displayModal.value = true;
        };
        const closeModal = () => {
            displayModal.value = false;
        }
</script>


<template >
    <Dialog  header="اضافة باقة" contentStyle="height: 263px; padding: 20px;"  v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '60vw'}" :modal="true">
  <form @submit.prevent="submitForm">

   <div class="grid p-fluid ">
    
    <div class="field col-12 md:col-4">
        <span class="p-float-label" >
            <InputText id="name" type="text" v-model="state.name"  />
            <label  for="name">اسم الباقة </label>
            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="amountOfPower" type="text" v-model="state.amountOfPower" />
            <label for="amountOfPower" >Amount Of Power</label>
            <error  v-for="error in v$.amountOfPower.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="acpPort" type="text" v-model="state.acpPort" />
            <label for="acpPort" >Acp Port</label>
            <error  v-for="error in v$.acpPort.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label">
            <InputText id="monthlyVisits" type="text" v-model="state.monthlyVisits" />
            <label for="monthlyVisits" >عدد الزيارات في الشهر</label>
            <error  v-for="error in v$.monthlyVisits.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="Dns" type="text" v-model="state.dns" />
            <label for="Dns" >Dns</label>
            <error  v-for="error in v$.dns.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="price" type="text" v-model="state.price" />
            <label for="price" > سعر الباقة بالدينار</label>
            <error  v-for="error in v$.price.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

</div>

<Button  class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
<Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" style="margin-right: .5em;" />
<Toast position="bottom-left" />

</form>
<template #footer>
        
<!-- <Toast position="bottom-right" /> -->

            </template>
        </Dialog>
        <Button @click="openModal" style="" label="اضافة باقه"  icon="fa-solid fa-plus " class=" mb-4 ml-4 p-button-primry " ></Button>

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