<script lang="ts" setup>import { useToast } from 'primevue/usetoast';
import { reactive } from 'vue';


const state = reactive({
    startWorkTime:'',
    endWorkTime:'',
    priceInWorkTime: 0,
    priceAfterWorkTime:0,
    priceAfterMidnight:0,
})
const toast = useToast();

const submitForm = async () => {

    // if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تم تعديل الاعدادات', life: 3000});
    // }

        }


</script>

<template>
    <div>
    <Card>

        <template #title>
            اعدادات النظام
            
        </template>

        <template #content>
            <form @submit.prevent="submitForm">

            <Divider/>

            <h3>ساعات الدوام</h3>

            <div class="grid p-fluid ">

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">

                                <Calendar  inputId="startWorkTime" v-model="state.startWorkTime" dateFormat="yy/mm/dd" :showTime="true"
                                :timeOnly="true" selectionMode="single" :manualInput="true" 
                                    :stepMinute="5" hourFormat="12"  />
                                <label for="startWorkTime">وقت بداية الدوام</label>
                            </span>
                        </div>
                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">

                                <Calendar inputId="endWorkTime" v-model="state.endWorkTime" dateFormat="yy/mm/dd" :showTime="true"
                                :timeOnly="true" selectionMode="single"   :manualInput="true" 
                                    :stepMinute="5" hourFormat="12"  />
                                <label for="endWorkTime">وقت  نهاية الدوام</label>
                            </span>
                        </div>
                        
        </div>

        <Divider/>
       
            <h3>اسعار اوقات الزيارات</h3>
            <div class="grid p-fluid ">
                <div class="field col-12 md:col-4">
                <label for="priceInWorkTime" >السعر  وقت الدوام </label>
                <InputNumber inputId="stacked" v-model="state.priceInWorkTime"  
                suffix=" دينار" :step="0.25" :min="0" :allowEmpty="false" :highlightOnFocus="true"/>
                </div>
                <div class="field col-12 md:col-4">
                <label for="priceAfterWorkTime">السعر  بعد وقت الدوام</label>
                <InputNumber inputId="priceAfterWorkTime" v-model="state.priceAfterWorkTime"  
                suffix=" دينار" :min="0" :allowEmpty="false" :highlightOnFocus="true"/>
                </div>
                <div class="field col-12 md:col-4">
                <label for="priceAfterMidnight">السعر  بعد منتصف الليل </label>
                <InputNumber inputId="priceAfterMidnight" v-model="state.priceAfterMidnight"  
                suffix=" دينار" :min="0" :allowEmpty="false" :highlightOnFocus="true"/>
                </div>

        </div>
        <Divider/>

        <Button @click="submitForm"  icon="fa-solid fa-floppy-disk fa-flip" style="--fa-animation-duration: 2s;
         --fa-animation-delay:5s; --fa-animation-iteration-count:5" label="تخزين"  />
                        <Toast position="bottom-right" />
        </form>
        </template>

    </Card>
</div>

</template>

<style >

</style>