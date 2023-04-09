<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers';
import addCompanion from './addCompanion.vue';
import router from '@/router';
import type {Visit} from './modules/VisitModule'

const store = useCustomersStore();

const visit:Visit = reactive({
    customerName: "ليبيا اب",
    authorizedName: "شم",
    companionName: "م",
    visitReason: "",
    startVisit:"12/11/2022"  ,
    endVisit: "" ,
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


// const duration = Math.abs(visit:Visit.endVisit - visit:Visit.startVisit)


 const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {

}

const rules = computed(() => {
    return {
        customerName: { required: helpers.withMessage('اسم العميل مطلوب', required) },
        authorizedName: { required: helpers.withMessage(' المخول مطلوب', required) },
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, visit);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
    }

}

const resetForm = () => {
    visit.customerName = '';
    visit.authorizedName = '';
    visit.companionName = '';
    visit.visitReason = "";
    visit.startVisit     = "";
    visit.endVisit =  "",
    visit.visitDuration = "",
    visit.price = ""
}

function backButton() {
router.go(-1)
}

</script>

<template >
    <div>{{ visit.endVisit }}
        <Card>

            <template #title>

                بيانات الزيارة
                <Button @click="backButton" icon="fa-solid   fa-arrow-left fa-shake-hover" rounded aria-label="Filter" style="float: left;"/>                
                <Divider/>
                
            </template>
            <template #content>
                <div class="flex flex-row">
                    
                    <div class="flex-1">
                        <h3 style="margin: 0;">اسم الجهة : {{ visit.customerName }}</h3>
                         <div>
                         <h4   v-if="visit.authorizedName">المخولين:</h4>
                         <p  class=" mr-2" v-for="aut in visit.authorizedName">
                           - {{ aut }}
                        </p>

                        <h4   v-if="visit.companionName" style="margin-bottom:0;">المرافقين:</h4>
                        <p  class="mr-2" v-for="comp in visit.companionName">
                           - {{ comp }}
                        </p>
                        </div>
                    </div>
            <Divider class="p-divider-solid" layout="vertical" />
    
            <div class="flex-1"> 


            <h3 style="margin: 0;">تاريخ الزيارة :</h3>
            <p class="inline-block">
             -تاريخ بدء الزيارة :   {{ visit.startVisit }}
            </p>

            <p class="inline-block">
             -تاريخ انتهاء الزيارة :   {{ visit.endVisit }}
            </p>

        </div>
        <Divider class="p-divider-solid" layout="vertical" />

        <div class="flex-1">
          
            <h3 style="margin: 0;">عدد ساعات الزيارة</h3>
            <p>{{ visit.visitDuration }}</p>

            <h3 style="margin: 0;">تكلفة الزيارة :</h3>
            <p >{{ visit.price }}</p>
        </div>
    </div>
            </template>
                   
                


        </Card>
    </div>
    <Card class="mt-3">
        <template #title>
           سبب الزيارة :{{  }}
        </template>
        <template #content>
        وصف الزيارة :
        <p>
            
        </p>
        </template>
    </Card>
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