<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCounterStore } from '@/stores/packages'
import Dialog from 'primevue/dialog';
import axios from 'axios';



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

// const submitForm = async () => {
//     const result = await v$.value.$validate();

//     if(result){
//         toast.add({severity:'success', summary: 'Success Message', detail:'تمت إضافة الباقة', life: 3000});
//     }

//         }

const resetForm = () => {
    state.name = '';
    state.AcpPort= '';
    state.amountOfPower = '';
    state.Dns= '';
    state.monthlyVistsShare='';
    state.pricePerYear='';
        }

        const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        axios.post("http://localhost:3000/services", state)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error)
            })
            displayModal.value = false;

        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة باقة', life: 3000 });

    } else {
        console.log("empty")
    }
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
            <InputText id="AcpPort" type="text" v-model="state.AcpPort" />
            <label for="AcpPort" >Acp Port</label>
            <error  v-for="error in v$.AcpPort.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
        </span>
    </div>

    <div class="field col-12 md:col-4">
        <span class="p-float-label">
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
<Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5em;" />
                        <Toast position="bottom-right" />

            </template>
        </Dialog>
        <Button  @click="openModal"
             style="height: 25px; width: 25px;"
             icon=" fa-solid fa-pen"
             class=" mt-2 mr-2 p-button-primary p-button-text" 
             v-tooltip="{value:'تعديل الباقة', fitContent:true}" />
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