<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import AutoComplete from 'primevue/autocomplete';
import Divider from 'primevue/divider';
const state = reactive({
    name: "",
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


        </script>


<template >
     <div>
        <Card >
            <template  #title>
          
                إضافة خدمة  
             
        
                <Divider layout="horizontal" />

            </template>


            <template #content>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <AutoComplete v-model="selectedCountry1" :suggestions="filteredCountries" @complete="searchCountry($event)" optionLabel="name" />                            <label  for="name">اسم </label>
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
                            <label for="address" >عنوان العميل</label>
                            <error  v-for="error in v$.address.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id ="phoneNum1" v-model="state.phoneNumber1" mask="999-999-9999" />
                            <label for="phoneNum1">رقم هاتف العميل</label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id="phoneNum2" v-model="state.phoneNumber2" mask=" 999-999-9999" />
                            <label for="phoneNum2">رقم هاتف 2</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <Dropdown id="subscription" v-model="state.subscriptionType" placeholder="اختر الباقه" emptyMessage="لايوجد باقات"/>
                            <label for="subscription">الباقة</label>
                        </span>
                    </div>

                    <div class="field col-12 md:col-4" style="height: 1%;">
                    <FileUpload style="font-family: tajawal; width: 250px; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
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
                <Button @click="submitForm" class="p-button-rounded p-button-success" icon="pi pi-check" label="إضافة" type="submit" />
                <Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary p-button-rounded p-button-danger " style="margin-right: .5em;" />
                <Toast position="bottom-right" />

            </form>
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
color: #6c757d;
transition-duration: 0.2s
}
/* .menuitem-content:hover {

} */
</style>