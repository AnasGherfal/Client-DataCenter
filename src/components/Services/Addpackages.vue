<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCounterStore } from '@/stores/packages'
import ServicesList from './ServicesList.vue';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';

const state = reactive({
    name: '',
    amountOfPower: '',
    AcpPort: '',
    Dns: '',
    monthlyVistsShare:'',
    pricePerYear:'',

})

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('ادخل اسم الباقة',required)},
    amountOfPower: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    Dns: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    AcpPort: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    monthlyVistsShare: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    pricePerYear: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تمت إضافة الباقة', life: 3000});
    }

        }

const resetForm = () => {
    state.name = '';
    state.AcpPort= '';
    state.amountOfPower = '';
    state.Dns= '';
    state.monthlyVistsShare='';
    state.pricePerYear='';
        }

    const store=useCounterStore()
    
    function Addpackage(){
  
    store.Services.unshift ( {
    id: state.name,
    name:state.name,
    amountOfPower:state.amountOfPower,
    AddamountOfPower:'',
    AcpPort:state.AcpPort,
    Dns:state.Dns,
    monthlyVistsShare: state.monthlyVistsShare,
    pricePerYear: state.pricePerYear
  })
  


}

const displayModal = ref(false);

const openModal = () => {
            displayModal.value = true;
        };
        const closeModal = () => {
            displayModal.value = false;
        }
</script>


<template >
    <Dialog  header="اضافة باقة" contentStyle="height: 200px; padding: 20px;"  v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '60vw'}" :modal="true">
    
  <form @submit.prevent="submitForm">
   <div class="grid p-fluid ">
    <div class="field col-12 md:col-4 ">
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
            <InputText id="AcpPort" type="text" v-model="state.AcpPort" />
            <label for="AcpPort" >Acp Port</label>
            <error  v-for="error in v$.AcpPort.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="monthlyVistsShare" type="text" v-model="state.monthlyVistsShare" />
            <label for="monthlyVistsShare" >عدد الزيارات في الشهر</label>
            <error  v-for="error in v$.monthlyVistsShare.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="Dns" type="text" v-model="state.Dns" />
            <label for="Dns" >Dns</label>
            <error  v-for="error in v$.Dns.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label ">
            <InputText id="pricePerYear" type="text" v-model="state.pricePerYear" />
            <label for="pricePerYear" > سعر الباقة بالدينار</label>
            <error  v-for="error in v$.pricePerYear.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

</div>

</form>
<template #footer>
    <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
<Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary" style="margin-right: .5em;background-color: red;" />
<Toast position="bottom-right" />

            </template>
        </Dialog>

    <Button @click="openModal" style="height: 40px; width: 40px;" icon="fa-solid fa-plus text-green-50" class="fixed mb-4 ml-4 bottom-0 left-0 p-button-primry " />
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
color: #000000;
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

/* .menuitem-content:hover {

} */
</style>