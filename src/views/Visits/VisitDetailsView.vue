<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers';
import VisitDetails from './VisitDetails.vue';
import router from '@/router';
import type { Visit } from '../../Models/VistModel/VisitModule'
import axios from 'axios';

const store = useCustomersStore();
const id = defineProps<{ id: string }>();
const tab = ref({})



const compList = reactive([{}])


const visitReason = ref([
    { name: 'صيانه' },
    { name: 'انهاء عمل' },
])


onMounted(async () => {
    await axios.get("http://localhost:3000/visits")
        .then(function (response) {
            tab.value = response.data.filter((users: { name: String }) => users.name === id.id)[0];
            console.log(tab)
        })
        .catch(function (error) {
            console.log(error)
        })

})

let today = new Date();
let month = today.getMonth;
let year = today.getFullYear;
let hours = today.getHours();

const minDate = ref(new Date());



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

// const v$ = useVuelidate(rules, visit);

// const submitForm = async () => {
//     const result = await v$.value.$validate();

//     if (result) {
//         toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
//     }

// }


function backButton() {
    router.go(-1)
}

</script>

<template >
<VisitDetails :customer="tab" :key="tab.id"></VisitDetails>
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