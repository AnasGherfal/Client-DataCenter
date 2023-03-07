<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import {useUsersStore} from '@/stores/users'
import axios from 'axios';
import Divider from 'primevue/divider';


const store = useUsersStore();
const pp = ref<string>('');
const state = reactive({
    name: "" as string,
    email: "",
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',
    file: '',
    subscriptionType: '',
    numberOfHours:'',

})



const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('الاسم مطلوب',required)},
    email: {required: helpers.withMessage('الايميل مطلوب',required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)},
    address: {required: helpers.withMessage('العنوان مطلوب',required)},
    phoneNumber1: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);



const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
    axios.post("http://localhost:3000/users",state)
   .then(function(response) {
   console.log(store.users)
})
.catch(function(error){
   console.log(error)
 })
}else{
    console.log("empty")
}

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تمت إضافة العميل', life: 3000});
    }

        }

const resetForm = () => {
    state.name = '';
    state.email = '';
    state.phoneNumber1 = '';
    state.phoneNumber2 = '';
    state.address = '';
    state.file = '';


        }


</script>


<template >
    <div>
        <Card>
            <template #title>
                إضافة عميل
                <Divider/>

            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text" v-model="state.name"  />
                            <label  for="name">اسم </label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>

                    </div>
                   <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputText id="email" type="text" v-model="state.email"  />
                            <label for="email">البريد الإلكتروني</label>
                            <error  v-for="error in v$.email.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputText id="address" type="text" v-model="state.address" />
                            <label for="address" >العنوان</label>
                            <error  v-for="error in v$.address.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id ="phoneNum1" v-model="state.phoneNumber1" mask="999-999-9999" />
                            <label for="phoneNum1">رقم هاتف </label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id="phoneNum2" v-model="state.phoneNumber2" mask=" 999-999-9999" />
                            <label for="phoneNum2">رقم هاتف 2</label>
                        </span>
                    </div>


                    <div class="field col-12 md:col-4" >
                    <FileUpload class="field col-12 md:col-4" v-model="state.file" style="width: 270px; height: 40px; background-color: white; color:black; border-color: lightgray"
                    mode="basic"
                     name="file[]" 
                     url="./upload" 
                     chooseLabel=" ارفق ملف" 
                     cancelLabel="إلغاء"
                     :showUploadButton="false"
                     :showCancelButton="false"
                     :maxFileSize="1000000"
                     invalidFileSizeMessage="Exceeded the maximum file size"
                     />
                     </div>


                </div>
                <Button @click="submitForm"  icon="pi pi-check" label="إضافة" type="submit" />
                <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-secondary" style="margin-right: .5em; background-color: red;" />
                <Toast position="bottom-right" />

            </form>
            </template>
            

        </Card>
        
    </div>
</template>
<style scoped>


.p-button-icon{
    padding-left: 0.5rem;
}



.p-float-label > label{
right: 0.5rem;
color: black;
transition-duration: 0.3s
}

/* .menuitem-content:hover {

} */
</style>