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
    CustomerName: "",
    authorizedName: "",
    companionName: "",
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