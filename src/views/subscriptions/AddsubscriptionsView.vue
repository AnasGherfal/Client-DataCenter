<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import BackButton from '@/components/BackButton.vue';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import axios from 'axios';
import router from '@/router';
import { useCustomersStore } from '@/stores/customers';
import type { Subscription } from './SubscriptionsModels';
import moment from 'moment';


const store = useSubscriptionsStore();
const storeCustomer = useCustomersStore();

const loading = ref(false);
const ServicesList=ref();

const state:Subscription = reactive({
    serviceId:null,
    customerId:null,
    startDate:'',
    endDate:'',
    subscriptionFileId:null

})


  


  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Service")
      .then(function (response) {
        ServicesList.value= response.data.content;
      })
      .catch(function (error) {
        console.log(error)
      })

  }) 
  


console.log(state.startDate)

const rules = computed(() => {
    return {
        customerId: { required: helpers.withMessage('الحقل مطلوب', required) },
        startDate: { required: helpers.withMessage('الحقل مطلوب', required) },
        endDate: { required: helpers.withMessage(' الحقل مطلوب', required), minValue: helpers.withMessage('تاريخ انتهاء الاشتراك يجب ان يكون بعد تاريخ البدايه', minValue(state.startDate)) },
        serviceId: { required: helpers.withMessage('الحقل مطلوب', required) },
    }
})

console.log(state)
const serId=ref();

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    console.log(typeof(state.endDate))
    console.log( moment(state.startDate).format('yy/M/d hh:mm a' ))

    const result = await v$.value.$validate();

    if (result) {

     loading.value = true;

    const subrequest:Subscription = reactive({
    serviceId: state.serviceId.id,
    customerId: state.customerId.id,
    startDate: state.startDate,
    endDate:state.endDate,
           }) 


        await axios.post("https://localhost:7003/api/Subscription", subrequest)
                .then(function (response) {
                toast.add({ severity: 'success', summary: 'تمت اضافة اشتراك', detail: response.data.msg, life: 3000 });

                    console.log(response)
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

    state.serviceId=null,
    state.customerId=null,
    state.startDate='',
    state.endDate='',
    state.subscriptionFileId=null

}

const minDate = ref(new Date());
const invalidDates = ref();

const selectedCustomer = ref();
const filteredCountries = ref();


const search = (event:any) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredCountries.value = [...storeCustomer.customers];
        } else {
            filteredCountries.value = storeCustomer.customers.filter((users:{name:String}) => {
                return users.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

</script>


<template >
    <div>
        <Card>
            <template #title>

                إضافة اشتراك
                <BackButton style="float: left;"/>

                <Divider layout="horizontal" />
            </template>


            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <AutoComplete v-model="state.customerId"  optionLabel="name" :suggestions="filteredCountries" @complete="search" />
                                <label for="customerName">العملاء</label>

                                <error v-for="error in v$.customerId.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="startDate" v-model="state.startDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="startDate">تاريخ بداية الاشتراك</label>
                                <error v-for="error in v$.startDate.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>


                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endDate" v-model="state.endDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                                <error v-for="error in v$.endDate.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="subscriptionType" :options="ServicesList" optionLabel="name" v-model="state.serviceId" placeholder="اختر الباقه"
                                    emptyMessage="لايوجد باقات" />
                                <label for="subscriptionType">الباقة</label>
                                <error v-for="error in v$.serviceId.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4" style="height: 1%;">
                            <FileUpload v-model="state.subscriptionFileId"
                                style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                                mode="basic" name="File" url="./upload" chooseLabel=" ارفق ملف" cancelLabel="إلغاء"
                                :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                                invalidFileSizeMessage="Exceeded the maximum file size" />
                        </div>

                    </div>
                    <Button class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5em;" />
                    <Toast position="bottom-right" />

                </form>
            </template>

        </Card>
    </div>
</template>
<style>
error {
    font-size: 12px;
    font-weight: bold;
}

.p-dropdown {
    border-radius: 10px;
}

.p-float-label>label {
    right: 0.5rem;
    color: #6c757d;
    transition-duration: 0.2s
}

/* .menuitem-content:hover {

} */
</style>