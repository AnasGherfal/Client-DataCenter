<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import { required, helpers, minValue, requiredIf, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from 'axios';
import moment from 'moment';
import type { VisitHours } from './Models/VisitHoursModels'

//Needs Validation
const getVisitsHours = ref();
const selectedHours = ref();



const formChanged = ref(false);


const rules = computed(() => {
    return {
        // endWorkTime: { requiredIf: helpers.withMessage('الحقل مطلوب ', requiredIf(state.startTime)), minValue: helpers.withMessage('يجب ان يكون يساوي او بعد وقت البدايه', minValue(state.startTime)) },
    }
})

const toast = useToast();
// const v$ = useVuelidate(rules, visitHours);



onMounted(async () => {
    await axios.get("https://localhost:7003/api/VisitTimeShift")
        .then((response) => {
            getVisitsHours.value = response.data.content;
          
            // console.log(visitHours.startTime)

        })
        .catch(function (error) {
            console.log(error)
        })

})

const submitForm = async () => {
    // const result = await v$.value.$validate();
        
    const send = reactive<VisitHours>({
    name: selectedHours.value.name,
    startTime: moment(selectedHours.value.startTime).format('HH:mm:ss'),
    endTime: moment(selectedHours.value.endTime).format('HH:mm:ss'),
    priceForFirstHour: selectedHours.value.priceForFirstHour,
    priceForRemainingHour: selectedHours.value.priceForRemainingHour

})

    await axios.put(`https://localhost:7003/api/VisitTimeShift/${selected}`, send)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'نجاح العمليه', detail: `${response.data.msg}`, life: 3000 });


        })
        .catch(function (error) {
            toast.add({ severity: 'error', summary: 'حدث خطأ', detail: 'لم يتم التعديل', life: 3000 });

            console.log(error)
        })


}
let selected = 1;
const getIndex = (index: any) => {

    selected = index;

}

</script>

<template>Needs Validation/ post
    <div> 

        <form @submit.prevent="submitForm">
            <div class="grid p-fluid ">
                <div class="field col-12 md:col-4 mt-2">
                    <span class="p-float-label ">
                        <Dropdown @change="getIndex(selectedHours.id)" v-model="selectedHours" :options="getVisitsHours"
                            optionLabel="name" placeholder="اختر ساعات للتعديل" class="w-full md:w-14rem" />
                        <label for="hoursName">الساعات</label>

                    </span>
                </div>
            </div>

            <div v-if="selectedHours">
                <h3>{{ selectedHours.name }}</h3>{{ selectedHours.startTime }}
                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 mt-2">
                        <span class="p-float-label ">

                            <Calendar id="startTime" v-model="selectedHours.startTime" :showTime="true" :timeOnly="true"
                                hourFormat="24" selectionMode="single" :manualInput="true" :stepMinute="15" :show-seconds="true"
                                @click="formChanged = true" :step-second="60" />
                            <label for="startTime">من </label>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4 mt-2">
                        <span class="p-float-label ">

                            <Calendar inputId="endTime" v-model="selectedHours.endTime" :showTime="true" :timeOnly="true"
                                selectionMode="single" :manualInput="true" :stepMinute="15" hourFormat="24"
                                @input="formChanged = true" :show-seconds="true"  :step-second="60" />
                            <!-- <error v-for="error in v$.endWorkTime.$errors" :key="error.$uid" class="p-error ">
                                                        {{ error.$message }}</error> -->
                            <label for="endTime">الى</label>

                        </span>
                    </div>

                </div>
                <div class="grid p-fluid ">

                    <div class="field col-12 md:col-4">

                        <label for="priceFirstHour"> سعر الساعه الاولى </label>
                        <InputNumber inputId="priceForFirstHour" v-model="selectedHours.priceForFirstHour" suffix=" دينار"
                            :step="0.25" :min="0" :allowEmpty="false" :highlightOnFocus="true"
                            @input="formChanged = true" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="priceAfter">سعر باقي الساعات </label>
                        <InputNumber inputId="priceForRemainingHour" v-model="selectedHours.priceForRemainingHour"
                            suffix=" دينار" :step="0.25" :min="0" :allowEmpty="false" :highlightOnFocus="true" />
                    </div>
                </div>
            </div>

            <Divider />

            <Button @click="submitForm" :disabled="!formChanged" icon="fa-solid fa-floppy-disk fa-flip fa-flip-hover"
                style="--fa-animation-duration: 2s; --fa-animation-delay:5s; --fa-animation-iteration-count:5" label="تخزين"
                class="" />
            <Toast position="bottom-left" />

        </form>

    </div>
</template>