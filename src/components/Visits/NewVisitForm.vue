<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import {required, helpers, minValue  } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers';
import addCompanion from './addCompanion.vue';
import router from '@/router';
import moment from 'moment';

const store = useCustomersStore();

const state = reactive({
    customerName: "",
    authorizedName: "",
    companionName: "",
    visitReason: "",
    startVisit: "",
    endVisit: "",
    visitDuration: "ساعه",
    price: "100دينار",
})

const compList = reactive([{}])


const visitReason = ref([
    { name: 'صيانه' },
    { name: 'انهاء عمل' },
])


const startDate =ref(new Date());
const endDate = ref(new Date());

const date = new Date((moment(state.startVisit).format('hh:mm a')))
const minDate = ref(date);


const updateEndDate = () => {
      if (startDate.value > endDate.value) {
        endDate.value = startDate.value;
      }
    };


const invalidDates = ref();


const filterdUsers = ref();

const searchUsers = () => {

}

const rules = computed(() => {
    return {
        customerName: { required: helpers.withMessage(' الحقل مطلوب', required) },
        authorizedName: { required: helpers.withMessage('الحقل مطلوب', required) },
        visitReason:{required: helpers.withMessage('الحقل مطلوب', required) },
        startVisit: { required: helpers.withMessage('  الحقل مطلوب', required) },
        endVisit: { required: helpers.withMessage(' الحقل مطلوب', required), minValue: helpers.withMessage('تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه', minValue(state.startVisit))},

    }
})

    // Validate that end date is not before start date
    const isEndDateValid = computed(() => {
      return !state.endVisit || !state.startVisit || state.endVisit >= state.startVisit ;
    });

const toast = useToast();

const v$ = useVuelidate(rules, state);

function invalidDate(){
    if(state.endVisit<= state.startVisit){
        alert('error')
    }
}

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
    }

}

const resetForm = () => {
    state.customerName = '';
    state.authorizedName = '';
    state.companionName = '';
    state.visitReason = "";
    state.startVisit = "";
    state.endVisit = "",
        state.visitDuration = "",
        state.price = ""
}

function backButton() {
    router.push("/VisitsRecords")

}

</script>

<template >
    <div>
        <Card>
            <template #title>
                إنشاء زيارة
                <Button @click="backButton" icon="fa-solid fa-arrow-left fa-shake-hover" rounded aria-label="Filter"
                    style="float: left;" />
                <Divider />

            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <MultiSelect v-model="state.customerName" :options="store.users" optionLabel="name"
                                    :filter="true" placeholder=" اختر عميل" :selectionLimit="1"/>
                                <label for="customerName">العملاء</label>

                                <error v-for="error in v$.customerName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-6 lg:col-4 ">
                            <span class="p-float-label">
                                <MultiSelect v-model="state.authorizedName" :options="store.users" optionLabel="email"
                                    placeholder="اختر" emptySelectionMessage="ll" :selectionLimit="2" />
                                <label for="authorizedName">المخولين</label>

                                <error v-for="error in v$.authorizedName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="" v-model="state.visitReason" :options="visitReason" optionLabel="name" />
                                <label for="visitReason">سبب الزيارة </label>
                                <error v-for="error in v$.visitReason.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">

                                <Calendar inputId="startVisit" v-model="state.startVisit"
                                    dateFormat="yy/mm/dd" :showTime="true" selectionMode="single" :minDate="startDate" 
                                    :showButtonBar="true" :manualInput="true" :stepMinute="5" hourFormat="12" @onChange="updateEndDate"  />
                                <label for="startVisit">تاريخ بداية الزيارة </label>
                                <error v-for="error in v$.startVisit.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                                
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endVisit" v-model="state.endVisit" dateFormat="yy/mm/dd"
                                    :showTime="true" selectionMode="single" :minDate="startDate"  :showButtonBar="true"
                                    :manualInput="true" :stepMinute="5" hourFormat="12" />
                                <label for="endVisit">تاريخ انتهاء الزيارة </label>
                                <error v-for="error in v$.endVisit.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>


                        <div class="field col-6 md:col-3 lg:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.visitDuration" :readonly="true" />
                                <label for="companionName"> مدة الزيارة </label>

                            </span>
                        </div>
                        <div class="field col-6 md:col-3 lg:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.price" :readonly="true" />
                                <label for="companionName"> السعر </label>
                            </span>
                        </div>
                    </div>




                    <addCompanion :compList="compList" />
                    <br><br>
                    <div v-if="compList.length > 1">
                        {{ compList }}
                        المُرافقين :
                        <div class="field col-12 md:col-2">

                            <Card v-for="i in compList">

                            </Card>
                        </div>
                    </div>

                    <Button @click="submitForm" icon="fa-solid fa-plus" label="إنشاء" type="submit" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5rem;" />
                    <Toast position="bottom-right" />
                </form>

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