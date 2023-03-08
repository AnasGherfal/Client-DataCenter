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

const stateService = reactive({
    nameCustomer: "",
    startDate:'',
    endtDate:'',
    subscriptionType:'',
    File: '',
})

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('الاسم مطلوب',required)},
    startDate: {required: helpers.withMessage('الايميل مطلوب',required),},
    endDate: {required: helpers.withMessage('العنوان مطلوب',required)},
    subscriptionType: {required: helpers.withMessage('العنوان مطلوب',required)},
    File: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, stateService );

const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تم الإشتراك', life: 3000});
    }

        }

const resetForm = () => {
         stateService.File='',
         stateService.endtDate='',
         stateService.startDate='',
         stateService.nameCustomer='',
         stateService.subscriptionType=''
        }

        const minDate = ref(new Date());
        const invalidDates = ref();
        </script>


<template >
     <div>
        <Card >
            <template  #title>
          
                إضافة اشتراك  
             
                <Divider layout="horizontal" />

            </template>


            <template #content>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <AutoComplete v-model="stateService.nameCustomer"  optionLabel="name" /> 
                                                       <label  for="name">اسم العميل </label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error> </span>

                    </div>
                    
                    <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="startDate" v-model="stateService.startDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="visitDate">تاريخ بداية الاشتراك</label>
                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endDate" v-model="stateService.endtDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="visitDate">تاريخ انتهاء الاشتراك</label>
                            </span>
                        </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <Dropdown id="subscriptionType" v-model="stateService.subscriptionType" placeholder="اختر الباقه" emptyMessage="لايوجد باقات"/>
                            <label for="subscription">الباقة</label>
                        </span>
                    </div>

                    <div class="field col-12 md:col-4" style="height: 1%;">
                    <FileUpload v-model="stateService.File" style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                    mode="basic"
                     name="File" 
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
                <Button @click="submitForm" class="p-button-primry" icon="pi pi-check" label="إضافة" type="submit" />
                <Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary " style="margin-right: .5em; background-color: red;" />
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