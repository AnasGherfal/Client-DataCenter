<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import axios from 'axios';

const pakgeInfo = defineProps<{
pakge:string
}>()

const state = reactive({
    name: pakgeInfo.pakge.name,
    amountOfPower: pakgeInfo.pakge.amountOfPower,
    acpPort: pakgeInfo.pakge.acpPort,
    dns: pakgeInfo.pakge.dns,
    monthlyVisits: pakgeInfo.pakge.monthlyVisits,
    price: pakgeInfo.pakge.price,
})

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('ادخل اسم الباقة',required)},
    amountOfPower: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    dns: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    acpPort: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    monthlyVisits: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    price: {required: helpers.withMessage('يجب تعبئة ه>ا الحقل',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);


const resetForm = () => {
    state.name = '';
    state.acpPort= '';
    state.amountOfPower = '';
    state.dns= '';
    state.monthlyVisits='';
    state.price= ''
        }

    const submitForm = async () => {
    const result = await v$.value.$validate();
    if (result) {
        axios.put('https://localhost:7003/api/Service?id='+ pakgeInfo.pakge.id,{
          name: state.name,
          amountOfPower: state.amountOfPower,
          acpPort: state.acpPort,
          dns: state.dns,
          monthlyVisits: state.monthlyVisits,
          price: state.price,
        })
        .catch(function (error) {
                console.log(error)
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'تم تعديل الباقة', life: 3000 });
            })            
            displayModal.value = false;
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
<Dialog  header="اضافة باقة" contentStyle="height: 250px; padding: 20px;"  v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '60vw'}" :modal="true">
  <form @submit="submitForm">
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
            <InputText id="dns" type="text" v-model="state.dns" />
            <label for="dns">Dns</label>
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


<Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="تعديل" type="submit" />
<Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" style="margin-right: .5em;" />
</form>

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

</style>