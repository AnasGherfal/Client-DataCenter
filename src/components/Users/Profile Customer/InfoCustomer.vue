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
    File: '',
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
    state.File = '';


        }

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
                <Divider/>

            </template>
            <template #content>
                <div >

                <div  style="height: 1%;">
                     <img src="./assest/user-sign-icon-person-symbol-human-avatar-vector-12693195.png" style="height: 200px;width: 200px;"/>
                     </div>
                     <div>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid " >
                    <div class="field col-12 md:col-6 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text"  value="اشرف" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="name">اسم </label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>

                    </div>
                   <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="email" type="text" value="ashraf.howel@gmail.com" v-model="state.email" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="email">البريد الإلكتروني</label>
                            <error  v-for="error in v$.email.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="address" value="هون" type="text" v-model="state.address" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="address" >العنوان</label>
                            <error  v-for="error in v$.address.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputMask id ="phoneNum1" value="092-687-7622" v-model="state.phoneNumber1" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="phoneNum1">رقم هاتف </label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputMask id="phoneNum2" v-model="state.phoneNumber2" mask=" 999-999-9999" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="phoneNum2">رقم هاتف 2</label>
                        </span>
                    </div>

                </div>

            </form>
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
color: black;
transition-duration: 0.3s
}


.p-button:enabled:hover {
  background: #0d89ec;
  color: #ffffff;
  border-color: #0d89ec;
}


/* .menuitem-content:hover {

} */
</style>