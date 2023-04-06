<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import BackButton from '@/components/BackButton.vue';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import axios from 'axios';
import router from '@/router';

const store = useSubscriptionsStore();
const loading = ref(false);
const customer=ref();
const service=ref();
const ServicesList=ref();

const state = reactive({
    nameCustomer: "",
    startDate:"" ,
    endtDate: "",
    subscriptionType: "",
    File: null,

})

onMounted(async () => {
    await axios.get("https://localhost:7003/api/Customers/")
      .then(function (response) {
        customer.value = response.data.content.filter((users:{name:String}) => users.name === state.nameCustomer)[0].id;
      })
      .catch(function (error) {
        console.log(error)
      })

  })
  console.log(customer)

  onMounted(async () => {
    await axios.get("https://localhost:7003/api/Service")
      .then(function (response) {
        ServicesList.value= response.data.content;
        service.value = response.data.content.filter((users:{name:String}) => users.name === state.subscriptionType)[0].id;
      })
      .catch(function (error) {
        console.log(error)
      })

  }) 
  


console.log(state.startDate)

const rules = computed(() => {
    return {
        nameCustomer: { required: helpers.withMessage('الحقل مطلوب', required) },
        startDate: { required: helpers.withMessage('الحقل مطلوب', required) },
        endtDate: { required: helpers.withMessage(' الحقل مطلوب', required), minValue: helpers.withMessage('تاريخ انتهاء الاشتراك يجب ان يكون بعد تاريخ البدايه', minValue(state.startDate)) },
        subscriptionType: { required: helpers.withMessage('الحقل مطلوب', required) },
    }
})

console.log(state.subscriptionType.id)

const subrequest = reactive({
    serviceId: state.subscriptionType.id,
    customerId: customer,
    startDate: state.startDate,
    endDate: state.endtDate,
    subscriptionFileId:null
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        loading.value = true;

            loading.value = false;


        await axios.post("https://localhost:7003/api/Subscription", subrequest)
                .then(function (response) {
             
                  console.log(subrequest)
                    console.log(response)
                    store.getSub();
                  })
                .catch(function (error) {
                    console.log(error)
                })
              } else {
                        console.log("empty")
                    }

}

const resetForm = () => {
        state.File = null,
        state.endtDate = '',
        state.startDate = '',
        state.nameCustomer = '',
        state.subscriptionType = ''
}

const minDate = ref(new Date());
const invalidDates = ref();



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
{{ state }}

                    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <AutoComplete   v-model="state.nameCustomer" optionLabel="nameCustomer" />
                                <label for="nameCustomer">اسم العميل </label>
                                <error v-for="error in v$.nameCustomer.$errors" :key="error.$uid" class="p-error">{{
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
{{ state.subscriptionType.id }}
{{ subrequest }}

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endDate" v-model="state.endtDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                                <error v-for="error in v$.endtDate.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>
                        {{ subrequest.serviceId }}

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="subscriptionType" :options="ServicesList" optionLabel="name" v-model="state.subscriptionType" placeholder="اختر الباقه"
                                    emptyMessage="لايوجد باقات" />
                                <label for="subscriptionType">الباقة</label>
                                <error v-for="error in v$.subscriptionType.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4" style="height: 1%;">
                            <FileUpload v-model="state.File"
                                style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                                mode="basic" name="File" url="./upload" chooseLabel=" ارفق ملف" cancelLabel="إلغاء"
                                :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                                invalidFileSizeMessage="Exceeded the maximum file size" />
                        </div>


                    </div>
                    <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
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