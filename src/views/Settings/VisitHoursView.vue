<script lang="ts" setup>
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import { required, helpers, minValue, requiredIf, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from 'axios';

let visitsHours = ref();

const state = reactive({
    hoursName:'',
    startWorkTime: '',
    endWorkTime: '',
    priceFirstHour: 0,
    priceAfter: 0,

})
let pp = reactive([])

console.log(state.startWorkTime+1)

const rules = computed(() => {
    return {
        endWorkTime: { requiredIf: helpers.withMessage('الحقل مطلوب ', requiredIf(state.startWorkTime)), minValue: helpers.withMessage('يجب ان يكون يساوي او بعد وقت البدايه', minValue(state.startWorkTime)) },
    }
})

const toast = useToast();
const v$ = useVuelidate(rules, state);



const submitForm = async () => {
    const result = await v$.value.$validate();
    console.log(result)
    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'يجب ان يكون يساوي او بعد وقت البدايه', life: 3000 });
    }

}



 onMounted( async () =>{ 
    await axios.get("http://localhost:3000/visitHours")
        .then((response) =>{
            visitsHours = response.data;
            console.log(visitsHours)
    })
//     .then((data:any) => {
//         let results = [];
//         for(const id in data) {
//             results.push({id:id, name: data[id].name})
//         }
//         console.log(results)
//  })

    .catch(function(error){
        console.log(error)
      })

    })

</script>

<template>
    <div>

        <form @submit.prevent="submitForm">

        <div v-for="(i, index) in visitsHours" :key="index">

            <h3>{{ i.name }}</h3>

        <div class="grid p-fluid " >
            <div class="field col-12 md:col-4 mt-5">
                <span class="p-float-label ">

                    <Calendar  inputId="startTime" v-model="i.startTime" 
                        dateFormat="yy/mm/dd" :showTime="true" :timeOnly="true" selectionMode="single"
                        :manualInput="true" :stepMinute="5" hourFormat="12" /> 
                    <label for="startWorkTime">من </label>

                </span>
            </div>
            <div class="field col-12 md:col-4 mt-5">
                <span class="p-float-label ">

                    <Calendar  inputId="endTime" v-model="i['endTime']"
                        dateFormat="yy/mm/dd" :showTime="true" :timeOnly="true" selectionMode="single"
                        :manualInput="true" :stepMinute="5" hourFormat="12" />
                    <error v-for="error in v$.endWorkTime.$errors" :key="error.$uid" class="p-error ">
                        {{ error.$message }}</error>
                        <label for="endTime">الى</label>

                    </span>
                </div>

            <div class="field col-12 md:col-2">

                <label for="priceInWorkTime">السعر </label>
                <InputNumber inputId="stacked" v-model="i['priceFirstHour']" suffix=" دينار" :step="0.25" :min="0"
                    :allowEmpty="false" :highlightOnFocus="true" />
            </div>
            <div class="field col-12 md:col-2">
                <label for="priceInWorkTime">السعر </label>
                <InputNumber inputId="stacked" v-model="i['priceAfter']" suffix=" دينار" :step="0.25" :min="0"
                    :allowEmpty="false" :highlightOnFocus="true" />
                </div>

            </div>
        </div>

            <!-- <h3>ساعات بعد الدوام</h3>

                                    <div class="grid p-fluid ">

                                        <div class="field col-12 md:col-4">
                                            <span class="p-float-label ">

                                                <Calendar inputId="startWorkTime" v-model="state.startWorkTime" dateFormat="yy/mm/dd"
                                                    :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true"
                                                    :stepMinute="5" hourFormat="12" />
                                                <label for="startWorkTime">وقت بداية الدوام</label>
                                            </span>
                                        </div>
                                        <div class="field col-12 md:col-4">
                                            <span class="p-float-label ">

                                                <Calendar inputId="endWorkTime" v-model="state.endWorkTime" dateFormat="yy/mm/dd"
                                                        :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true"
                                                        :stepMinute="5" hourFormat="12" />
                                                    <label for="endWorkTime">وقت نهاية الدوام</label>
                                                </span>
                                            </div>

                                        </div> -->

            <!-- <h3>ساعات الليل</h3> -->

            <!-- <div class="grid p-fluid ">

                                            <div class="field col-12 md:col-4">
                                                <span class="p-float-label ">

                                                    <Calendar inputId="startWorkTime" v-model="state.startWorkTime" dateFormat="yy/mm/dd"
                                                        :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true"
                                                        :stepMinute="5" hourFormat="12" />
                                                    <label for="startWorkTime">وقت بداية الدوام</label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-4">
                                                <span class="p-float-label ">

                                                    <Calendar inputId="endWorkTime" v-model="state.endWorkTime" dateFormat="yy/mm/dd"
                                                        :showTime="true" :timeOnly="true" selectionMode="single" :manualInput="true"
                                                        :stepMinute="5" hourFormat="12" />
                                                    <label for="endWorkTime">وقت نهاية الدوام</label>
                                                </span>
                                            </div>

                                        </div> -->
            <AddNewHours />

            <Divider />

            <Button @click="submitForm" icon="fa-solid fa-floppy-disk fa-flip fa-flip-hover"
                style="--fa-animation-duration: 2s; --fa-animation-delay:5s; --fa-animation-iteration-count:5" label="تخزين"
                class="" />
            <Toast position="bottom-right" />
        </form>

    </div>
</template>