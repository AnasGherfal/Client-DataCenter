<script setup lang="ts">
import { validateText, isLibyanPhoneNumber } from '@/assets/validations';
import router from '@/router';
import { useCustomersStore } from '@/stores/customers';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import useVuelidate from '@vuelidate/core';
import { helpers, required, minLength, email } from '@vuelidate/validators';
import axios from 'axios';
import moment from 'moment';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import type { RequestUserModel } from './Models/RequestUserModel';

const store = useSubscriptionsStore();
const storeCustomer = useCustomersStore();
const actEdit=ref(false)

const loading = ref(false);
const ServicesList=ref();

const state:RequestUserModel = reactive({
FullName:'',
StartDate:'',
Email:'',
EmpId:null,
Password:''
})


const selectedCities = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);


  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Service")
      .then(function (response) {
        ServicesList.value= response.data.content;
      })
      .catch(function (error) {
        console.log(error)
      })

  }) 
  



const rules = computed(() => {
    return {
        FullName: {
            required: helpers.withMessage('الحقل مطلوب', required),
            validateText: helpers.withMessage(', حروف عربيه او انجليزيه فقط', validateText),
            minLength: helpers.withMessage('يجب أن يحتوي على الأقل 3 أحرف', minLength(3)),
        },
        Email: {
            required: helpers.withMessage('الحقل مطلوب', required),
            email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)
        },
        Password: { required: helpers.withMessage(' الحقل مطلوب', required)},
        StartDate: { required: helpers.withMessage('الحقل مطلوب', required) },
        EmpId: { required: helpers.withMessage('الحقل مطلوب', required) }

    }
})

console.log(state)
const serId=ref();

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    console.log( moment(state.StartDate).format('yy/M/d hh:mm a' ))

    const result = await v$.value.$validate();

    if (result) {

     loading.value = true;




        await axios.post("https://localhost:7003/api/Subscription", state)
                .then(function (response) {
                toast.add({ severity: 'success', summary: 'تمت اضافة اشتراك', detail: response.data.msg, life: 3000 });
                    console.log(response)
                    loading.value = false;
                    store.getSub();
                    router.go(-1)

                  })
                .catch(function (error) {
                    console.log(error)
                    toast.add({ severity: 'error', summary: 'هناك مشكلة', detail:'هنالك مشكلة في الوصول', life: 3000 });


                })
              } else {
                        console.log("empty")
                    }
                    loading.value = false;

}

const resetForm = () => {

    state.EmpId=null,
    state.StartDate='',
    state.FullName='',
    state.Email='',
    state.Password=''

}
</script>

<template >
    <div>

        <Card>

            <template #title>
                البيانات الشخصية

                <BackButton style="float: left;" />



                <div v-if="5">
                    <div class="warning-message">

                        <div class="warning-message-icon"></div>
                        <div class="warning-message-text">هاذا العميل في حالة قفل لا يمكن التعديل او اضافة مخوليين</div>

                    </div>

                </div>

                <Button v-else="customer.status !== 5" @click="actEdit = !actEdit" icon=" fa-solid fa-pen"
                    style="width: 30px;height: 30px; margin-right: 10px;" class=" p-button-primary p-button-text"
                    v-tooltip="{ value: 'تعديل البيانات الشخصية', fitContent: true }" />

                <Divider />

            </template>
            <template #content>
                <div v-if="store.loading" >
                    <div class="grid p-fluid">
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <Skeleton :loading="loading" width="100%" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div>


                        <form @submit.prevent="submitForm">

<div class="grid p-fluid ">
    
    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
    <InputText id="FullName" v-model="state.FullName" 
        style="direction: ltr; text-align: end;" />
    <label for="FullName">اسم الموظف</label>
    <div style="height: 2px;"> 
            <error v-for="error in v$.FullName.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>
</span>
    </div>

    <div class="field col-12 md:col-6 lg:col-4">
<span class="p-float-label">
    <InputText id="Email" type="text" v-model="state.Email" />
    <label for="Email">البريد الإلكتروني</label>
    <div style="height: 2px;">
        <span v-for="error in v$.Email.$errors" :key="error.$uid" class="p-error">
            {{ error.$message }}</span>
    </div>

</span>
</div>



    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
            <InputNumber id="EmpId" v-model="state.EmpId" 
        style="direction: ltr; text-align: end;" />
            <label for="EmpId">الرقم الوظيفي</label>
            <div style="height: 2px;"> 
            <error v-for="error in v$.EmpId.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>

        </span>
    </div>

    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
           

        <Password v-model="state.Password" toggle-mask dir="ltr"/>  
            <label style="right:40px;" for="subscriptionType">كلمة المرور</label>
            <div style="height: 2px;"> 
            <error v-for="error in v$.Password.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>
        </span>
    </div>

    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
            <div class="card flex justify-content-center">
<MultiSelect  v-model="selectedCities" display="chip" :options="cities" optionLabel="name" placeholder="Select Cities"
   :maxSelectedLabels="3" class="w-full md:w-20rem" />
   <label for="startDate">اختر الصلاحيات</label>
       </div>
            <div style="height: 2px;"> 
            <error v-for="error in v$.Password.$errors" :key="error.$uid" class="p-error">
            {{ error.$message }}</error>
                </div>

        </span>

    </div>



</div>
<Button class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" :loading="loading"/>
<Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
    style="margin-right: .5em;" />
<Toast position="bottom-right" />

</form>
</template>


        </Card>

    </div>

</template>

<style>
</style>