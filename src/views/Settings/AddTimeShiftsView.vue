<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import type { VisitHours } from '../../Models/TimeShifts/TimeShiftsModels'
import axios from 'axios';
import moment from 'moment';
const timeShifts: VisitHours = reactive({
    name: '',
    priceForFirstHour: null,
    priceForRemainingHour: null,
    startTime: '',
    endTime: ''
})

const loading = ref(false)

const emits = defineEmits(['getTimeShifts'])

const rules = computed(() => {
    return {
        name: { required: helpers.withMessage('الحقل مطلوب', required) },
        priceForFirstHour: { required: helpers.withMessage('الحقل مطلوب', required) },
        priceForRemainingHour: { required: helpers.withMessage('الحقل مطلوب', required) },
        startTime: { required: helpers.withMessage('الحقل مطلوب', required) },
        endTime: { required: helpers.withMessage('الحقل مطلوب', required) }
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, timeShifts);

const submitForm = async () => {
    const result = await v$.value.$validate();

    loading.value=true;

    const send = reactive<VisitHours>({
        name: timeShifts.name,
        startTime: moment(timeShifts.startTime).format('HH:mm:ss'),
        endTime: moment(timeShifts.endTime).format('HH:mm:ss'),
        priceForFirstHour: timeShifts.priceForFirstHour,
        priceForRemainingHour: timeShifts.priceForRemainingHour
    })


    if (result) {
        await axios.post("https://localhost:7003/api/VisitTimeShift", send)
            .then(function (response) {
                console.log(response)


                emits('getTimeShifts')
                toast.add({ severity: 'success', summary: 'Success Message', detail: `${response.data.msg}`, life: 3000 });
            })
            .catch(function (error) {
                console.log(error)
                toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'هناك مشكلة في عملية الادخال', life: 3000 });
            })
            loading.value = false
        displayModal.value = false;

        resetForm();
    }

}


const resetForm = () => {
    timeShifts.name = '',
        timeShifts.priceForFirstHour = null,
        timeShifts.priceForRemainingHour = null,
        timeShifts.startTime = '',
        timeShifts.endTime = ''

}



const displayModal = ref(false);

const openModal = () => {
    displayModal.value = true;
};
const closeModal = () => {
    displayModal.value = false;
}


</script>

<template>
        <Button @click="openModal" icon="fa-solid fa-plus" class=" p-button-primary p-button" label="إضافة ساعة جديده"> 
    </Button>
    <Dialog header="اضافة ساعه جديده" contentStyle="max-height: 80vh; max-width: 90vw; min-width:75vw; padding: 20px;"
        v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :modal="true">

        <form @submit.prevent="submitForm" style="height: 100%; display: flex; flex-direction: column;">
            <div class="grid p-fluid flex-grow-1">
                <div class="field col-12 md:col-4 lg:col-4">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="timeShifts.name" />
                        <label for="name">اسم الساعه </label>
                        <div style="height: 10px;"> 
                        <error v-for="error in v$.name.$errors" :key="error.$uid" class="p-error">{{ error.$message }}
                        </error>
                        </div>
                    </span>
                </div>
                <div class="field col-12 md:col-4 lg:col-4">
                    <span class="p-float-label">
                        <Calendar id="startTime" v-model="timeShifts.startTime" :showTime="true" :timeOnly="true"
                            hourFormat="24" selectionMode="single" :manualInput="true" :stepMinute="15" :show-seconds="true"
                            :step-second="60" />
                        <label for="startTime">وقت البداية </label>
                        <div style="height: 10px;"> 
                        <error v-for="error in v$.startTime.$errors" :key="error.$uid" class="p-error">{{ error.$message }}
                        </error>
                        </div>
                    </span>
                </div>
                <div class="field col-12 md:col-4 lg:col-4">
                    <span class="p-float-label ">
                        <Calendar inputId="endTime" v-model="timeShifts.endTime" :showTime="true" :timeOnly="true"
                            selectionMode="single" :manualInput="true" :stepMinute="15" hourFormat="24" :show-seconds="true"
                            :step-second="60" /> <label for="endTime">وقت النهاية </label>
                            <div style="height: 10px;"> 
                        <error v-for="error in v$.endTime.$errors" :key="error.$uid" class="p-error">{{ error.$message }}
                        </error>
                        </div>
                    </span>
                </div>
            </div>
            <div class="grid p-fluid">
                <div class="field col-12 md:col-4 lg:col-4">
                    <span class="flex flex-column gap-2 ">
                        <label for="priceFirstHour" style="font-size: small; font-weight: 100; color:lightslategray;"> سعر
                            الساعه الاولى </label>
                        <InputNumber inputId="priceForFirstHour" v-model="timeShifts.priceForFirstHour" suffix=" دينار"
                            :step="0.25" :min="0" :allowEmpty="false" :highlightOnFocus="true" />
                            <div style="height: 10px;"> 
                        <error v-for="error in v$.priceForFirstHour.$errors" :key="error.$uid" class="p-error">{{
                            error.$message }}
                        </error>
                        </div>
                    </span>
                </div>
                <div class="field col-12 md:col-4 lg:col-4">
                    <span class="flex flex-column gap-2 ">
                        <label for="priceForRemainingHour"
                            style="font-size: small; font-weight: 100; color:lightslategray;"> سعر باقي الساعات </label>
                        <InputNumber inputId="priceForRemainingHour" v-model="timeShifts.priceForRemainingHour"
                            suffix=" دينار" :step="0.25" :min="0" :allowEmpty="false" :highlightOnFocus="true" />
                            <div style="height: 10px;"> 
                        <error v-for="error in v$.priceForFirstHour.$errors" :key="error.$uid" class="p-error">{{
                            error.$message }}
                        </error>
                        </div>
                    </span>
                </div>
            </div>


        </form>
        <template #footer>
            <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" :loading="loading" />
            <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                style="margin-right: .5em;" />
            <Toast position="bottom-right" />

        </template>
    </Dialog>


</template>

<style ></style>