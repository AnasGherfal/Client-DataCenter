<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import { required, helpers, minValue, requiredIf, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from 'axios';
import moment from 'moment';



const state = reactive({
    startTime: ref<string>(moment().format('hh:mm a')),
    endTime: '',
    priceFirstHour: 0,
    priceAfter: 0,

})
const visitsHours = ref();
const selectedHours = ref();

const formChanged = ref(false);

    
const rules = computed(() => {
    return {
        // endWorkTime: { requiredIf: helpers.withMessage('الحقل مطلوب ', requiredIf(state.startTime)), minValue: helpers.withMessage('يجب ان يكون يساوي او بعد وقت البدايه', minValue(state.startTime)) },
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
            // console.log(visitsHours)

            state.startTime = visitsHours.value[0].startTime
            // console.log(state.startTime)


        })
        .catch(function (error) {
            console.log(error)
        })

})
const num = ([1,2,3])

const submitForm = async () => {
    const result = await v$.value.$validate();

    // console.log(result)
    toast.add({ severity: 'error', summary: 'حدث خطأ', detail: 'لم يتم التعديل', life: 3000 });


    axios.patch(`http://localhost:3000/visitHours/${selected}`, 
        { startTime: moment(state.startTime).format( 'hh:mm a') }, 
        // startTime: moment(state.startTime).format( 'hh:mm a'),
            // selectedHours: selectedHours.value,
            // priceFirstHour: state.priceFirstHour,
    )
        .then((response) => {
            console.log(response.data.startTime)
            // state.startTime = response.data.time;
            // response.data[0].startTime=state.startTime 
            console.log(state.startTime)


        })
        .catch(function (error) {
            console.log(error)
        })
    

}
let selected = 1 ;
const getIndex = (index:any) =>{
    
    selected = index;

}


</script>

<template>
    <div >

        <form @submit.prevent="submitForm">
            <div class="grid p-fluid ">
                <div class="field col-12 md:col-4 mt-2">
                    <span class="p-float-label ">
                        <Dropdown @change="getIndex(selectedHours.id)" v-model="selectedHours" :options="visitsHours" optionLabel="name"
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
                            
                            <Calendar id="startTime" v-model="state.startTime" :showTime="true" 
                             :timeOnly="true" 
                            hourFormat="12"
                                selectionMode="single" :manualInput="true" :stepMinute="5" @click="formChanged = true" />
                            <label for="startTime">من </label>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4 mt-2">
                        <span class="p-float-label ">

                            <Calendar inputId="endTime" v-model="selectedHours.endTime" 
                                :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true" :stepMinute="5"
                                hourFormat="12" @input="formChanged = true"/>
                            <!-- <error v-for="error in v$.endWorkTime.$errors" :key="error.$uid" class="p-error ">
                                {{ error.$message }}</error> -->
                            <label for="endTime">الى</label>

                        </span>
                    </div>

                </div>
                <div class="grid p-fluid ">

                    <div class="field col-12 md:col-4">

                        <label for="priceFirstHour"> سعر الساعه الاولى </label>
                        <InputNumber inputId="priceFirstHour" v-model="selectedHours.priceFirstHour" suffix=" دينار" :step="0.25" :min="0"
                            :allowEmpty="false" :highlightOnFocus="true" @input="formChanged = true"/>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="priceAfter">سعر اكثر من ساعه </label>
                        <InputNumber inputId="priceAfter" v-model="selectedHours.priceAfter" suffix=" دينار" :step="0.25"
                            :min="0" :allowEmpty="false" :highlightOnFocus="true" />
                    </div>
                </div>
            </div>

            <Divider />

            <Button @click="submitForm" :disabled="!formChanged" icon="fa-solid fa-floppy-disk fa-flip fa-flip-hover"
                style="--fa-animation-duration: 2s; --fa-animation-delay:5s; --fa-animation-iteration-count:5" label="تخزين"
                class="" />
            <!-- <Toast position="bottom-right" /> -->

        </form>

    </div>
</template>