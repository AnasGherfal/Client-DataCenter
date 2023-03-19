<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers';
import addCompanion from './addCompanion.vue';
import router from '@/router';

const store = useCustomersStore();

const state = reactive({
    CustomerName: "ليبيا اب",
    authorizedName: "شم",
    companionName: "م",
    visitReason: "",
    expectedStartVisit:""  ,
    expectedEndVisit: "" ,
    visitDuration: "ساعه",
    price: "100دينار",
})

const compList = reactive([{}])


const visitReason = ref([
    { name: 'صيانه' },
    { name: 'انهاء عمل' },
])


let today = new Date();
let month = today.getMonth;
let year = today.getFullYear;
let hours = today.getHours();

const minDate = ref(new Date());


// const duration = Math.abs(state.expectedEndVisit - state.expectedStartVisit)


 const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {

}

const rules = computed(() => {
    return {
        CustomerName: { required: helpers.withMessage('اسم العميل مطلوب', required) },
        authorizedName: { required: helpers.withMessage('رقم المخول مطلوب', required) },
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
    }

}

const resetForm = () => {
    state.CustomerName = '';
    state.authorizedName = '';
    state.companionName = '';
    state.visitReason = "";
    state.expectedStartVisit     = "";
    state.expectedEndVisit =  "",
    state.visitDuration = "",
    state.price = ""
}

function backButton() {
    router.push("/VisitsRecords")

}

</script>

<template >
    <div>{{ state.expectedEndVisit }}
        <Card>

            <template #title>

                بيانات الزيارة
                <Button @click="backButton" icon="fa-solid   fa-arrow-left fa-shake-hover" rounded aria-label="Filter" style="float: left;"/>                
                <Divider/>
                
            </template>
            <template #content>
                <div class="flex flex-row">
                    <div class="flex-1" style=" text-align: ;">
                        <h3 class="text-center" style="margin: 0;">اسم الجهة : {{ state.CustomerName }}</h3>
                        <Divider class="p-divider-solid mt-2" layout="horizontal" />
                         <h4 v-if="state.authorizedName" style="margin: 0;">المخولين:</h4>
                         <p  class="inline mr-2" v-for="aut in state.authorizedName">
                           - {{ aut }}
                        </p>

                        <h4  v-if="state.companionName" style="margin-bottom:0;">المرافقين:</h4>
                        <p  class="inline mr-2" v-for="comp in state.companionName">
                           - {{ comp }}
                        </p>
                    </div>
            <Divider class="p-divider-solid" layout="vertical" />
    
            <div class="flex-1"> 


            <h4 style="margin: 0;">تاريخ الزيارة :</h4>
            <p>
             تاريخ بدء الزيارة :   {{ state.expectedStartVisit }}
            </p>
            <p>
             تاريخ انتهاء الزيارة :   {{ state.expectedEndVisit }}
            </p>

        </div>
        <Divider class="p-divider-solid" layout="vertical" />

        <div class="flex-1">
          
            <h4 style="margin: 0;">عدد ساعات الزيارة</h4>
            <p style="margin: 0;">{{ state.visitDuration }}</p>

            <Divider class="p-divider-solid" layout="horizontal" />
            <h4 style="margin: 0;">تكلفة الزيارة :</h4>
            <p style="margin: 0;">{{ state.price }}</p>
        </div>
    </div>
            </template>
                   
                


        </Card>
    </div>
</template>
<style >
.p-button-icon {
    padding-left: 0;
}

.p-datepicker.p-datepicker-timeonly .p-timepicker {
    border-top: 0 none;
    direction: ltr;
}




</style>