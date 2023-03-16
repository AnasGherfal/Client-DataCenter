<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import AutoComplete from 'primevue/autocomplete';
import Divider from 'primevue/divider';
import router from '@/router';

const state = reactive({
    nameCustomer: "",
    startDate:'',
    endtDate:'',
    subscriptionType:'',
    File: '',

})

const rules = computed(() =>{
    return {
    nameCustomer:{  required: helpers.withMessage('الاسم مطلوب',required)},
    startDate: {required: helpers.withMessage('الايميل مطلوب',required)},
    endtDate: {required: helpers.withMessage('العنوان مطلوب',required)},
    subscriptionType: {required: helpers.withMessage('العنوان مطلوب',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules , state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تم الإشتراك', life: 3000});
    }

        }

const resetForm = () => {
    state.File='',
    state.endtDate='',
    state.startDate='',
    state.nameCustomer='',
    state.subscriptionType=''
        }

        const minDate = ref(new Date());
        const invalidDates = ref();


        function backButton() {
    router.push("/subscriptionsRecord")

}
        </script>


<template >
     <div>
        <Card >
            <template  #title>

                إضافة اشتراك  
                <Button @click="backButton" icon="fa-solid fa-arrow-left fa-shake-hover" style="float: left; "  >
                </Button> 
                <Divider layout="horizontal" />

            </template>


            <template #content>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <AutoComplete v-model="state.nameCustomer"  optionLabel="nameCustomer" /> 
                            <label  for="nameCustomer">اسم العميل </label>
                            <error  v-for="error in v$.nameCustomer.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error> </span>
                    </div>
                    
                    <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="startDate" v-model="state.startDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="startDate">تاريخ بداية الاشتراك</label>
                                <error  v-for="error in v$.startDate.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endDate" v-model="state.endtDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                                <error  v-for="error in v$.endtDate.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                            </span>
                        </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <Dropdown id="subscriptionType" v-model="state.subscriptionType" placeholder="اختر الباقه" emptyMessage="لايوجد باقات"/>
                            <label for="subscriptionType">الباقة</label>
                            <error  v-for="error in v$.subscriptionType.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>

                    <div class="field col-12 md:col-4" style="height: 1%;">
                    <FileUpload v-model="state.File" style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
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