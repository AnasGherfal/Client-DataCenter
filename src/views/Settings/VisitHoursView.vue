<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import { required, helpers, minValue, requiredIf, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from 'axios';
import moment from 'moment';


const visitsHours = ref();

const state = reactive({
    hoursName: [

    ],
    startWorkTime: ref<string>(moment().format('HH:mm')),
    endWorkTime: '',
    priceFirstHour: 0,
    priceAfter: 0,

})
const selectedHours = ref();

let pp = reactive([])

// const timeOptions = {
//   timeOnly: true,
//   hourFormat: '12' as '24' | '12' | undefined,
// };

// const formattedTimeValue = 
// startWorkTimeDate.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })
    
const rules = computed(() => {
    return {
        // endWorkTime: { requiredIf: helpers.withMessage('الحقل مطلوب ', requiredIf(state.startWorkTime)), minValue: helpers.withMessage('يجب ان يكون يساوي او بعد وقت البدايه', minValue(state.startWorkTime)) },
    }
})

const toast = useToast();
const v$ = useVuelidate(rules, state);



const handleInput = (event: any) => {
    // setPost({})

}

onMounted(async () => {
    await axios.get("http://localhost:3000/visitHours")
        .then((response) => {
            visitsHours.value = response.data;
            state.startWorkTime = response.data[0].startTime
            state.priceFirstHour = response.data[0].priceFirstHour


        })
        .catch(function (error) {
            console.log(error)
        })

})

const submitForm = async () => {
    const result = await v$.value.$validate();

    console.log(result)
    toast.add({ severity: 'error', summary: 'حدث خطأ', detail: 'لم يتم التعديل', life: 3000 });

    const val = await axios.patch(`http://localhost:3000/visitHours/`,
        {
            startTime: moment(state.startWorkTime).format( 'hh:mm a'),
            priceFirstHour: state.priceFirstHour,
        }
    )
        .then((response) => {
            console.log(response.data.startTime)


            // response.data[0].startTime=state.startWorkTime 
            console.log(state.startWorkTime)


        })
        .catch(function (error) {
            console.log(error)
        })
}


</script>

<template>
    <div>

        <form @submit.prevent="submitForm">
            <div class="grid p-fluid ">
                <div class="field col-12 md:col-4 mt-2">
                    <span class="p-float-label ">
                        <Dropdown v-model="selectedHours" :options="visitsHours" optionLabel="name"
                            placeholder="اختر ساعات للتعديل" class="w-full md:w-14rem" />
                        <label for="hoursName">الساعات</label>

                    </span>
                </div>
            </div>

            <div v-if="selectedHours">
                <h3>{{ selectedHours.name }}</h3>
                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 mt-2">
                        <span class="p-float-label ">
                            <Calendar inputId="startTime" v-model="state.startWorkTime" :showTime="true"   
                             :timeOnly="true" 
                            hourFormat="12"
                                selectionMode="single" :manualInput="true" :stepMinute="5"  />
                            <label for="startWorkTime">من </label>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4 mt-2">
                        <span class="p-float-label ">

                            <Calendar inputId="endTime" v-model="selectedHours.endTime" dateFormat="yy/mm/dd"
                                :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true" :stepMinute="5"
                                hourFormat="12" />
                            <!-- <error v-for="error in v$.endWorkTime.$errors" :key="error.$uid" class="p-error ">
                                {{ error.$message }}</error> -->
                            <label for="endTime">الى</label>

                        </span>
                    </div>

                </div>
                <div class="grid p-fluid ">

                    <div class="field col-12 md:col-4">

                        <label for="priceFirstHour"> سعر الساعه الاولى </label>
                        <InputNumber inputId="stacked" v-model="state.priceFirstHour" suffix=" دينار" :step="0.25" :min="0"
                            :allowEmpty="false" :highlightOnFocus="true" />
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="priceAfter">سعر اكثر من ساعه </label>
                        <InputNumber inputId="stacked" v-model="selectedHours.priceAfter" suffix=" دينار" :step="0.25"
                            :min="0" :allowEmpty="false" :highlightOnFocus="true" />
                    </div>
                </div>
            </div>

            <Divider />

            <Button @click="submitForm" icon="fa-solid fa-floppy-disk fa-flip fa-flip-hover"
                style="--fa-animation-duration: 2s; --fa-animation-delay:5s; --fa-animation-iteration-count:5" label="تخزين"
                class="" />
            <Toast position="bottom-right" />

        </form>

    </div>
</template>