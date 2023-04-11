<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from '@/stores/visits';
import addCompanion from './addCompanion.vue';
import moment from 'moment';
import type { Visit } from './modules/VisitModule'
import BackButton from '@/components/BackButton.vue';
import router from '@/router';
import axios from 'axios';


const store = useVistisStore();
const loading = ref(false);

const visit: Visit = reactive({
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


const startDate = ref(new Date());
const endDate = ref(new Date());

const date = new Date((moment(visit.startVisit).format('hh:mm a')))
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
        visitReason: { required: helpers.withMessage('الحقل مطلوب', required) },
        startVisit: { required: helpers.withMessage('  الحقل مطلوب', required) },
        endVisit: { required: helpers.withMessage(' الحقل مطلوب', required), minValue: helpers.withMessage('تاريخ انتهاء الزياره يجب ان يكون بعد تاريخ البدايه', minValue(visit.startVisit)) },

    }
})

// Validate that end date is not before start date
const isEndDateValid = computed(() => {
    return !visit.endVisit || !visit.startVisit || visit.endVisit >= visit.startVisit;
});

const toast = useToast();

const v$ = useVuelidate(rules, visit);

function invalidDate() {
    if (visit.endVisit <= visit.startVisit) {
        alert('error')
    }
}

const submitForm = async () => {
    const result = await v$.value.$validate();
    if (result) {

        loading.value = true;

        setTimeout(() => {
            router.go(-1)
            loading.value = false;

        }, 1000);

        // const subrequest: Visit = reactive({
        //     customerName: visit.customerName.customerName,
        //     authorizedName: visit.authorizedName.authorizedName

        // })

        await axios.post("http://localhost:3000/visits", visit)
            .then(function (response) {
                toast.add({ severity: 'success', summary: 'تمت الاضافه', detail: response.data.msg, life: 3000 });

                console.log(visit)
                console.log(response)
                store.getdata();

            })
            .catch(function (error) {
                console.log(error)
            })
    } else {
        console.log("not valid")
    }

}

const resetForm = () => {
    visit.customerName = '';
    visit.authorizedName = '';
    visit.companionName = '';
    visit.visitReason = "";
    visit.startVisit = "";
    visit.endVisit = "",
        visit.visitDuration = "",
        visit.price = ""
}



</script>

<template >
    <div>
        <Card>
            <template #title>
                إنشاء زيارة
                <BackButton style="float: left;" />

                <Divider />
                {{ visit.authorizedName }}

            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <MultiSelect v-model="visit.customerName" :options="store.visits" optionLabel="name"
                                    :filter="true" placeholder=" اختر عميل" :selectionLimit="1" />
                                <label for="customerName">العملاء</label>

                                <error v-for="error in v$.customerName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-6 lg:col-4 ">
                            <span class="p-float-label">
                                <MultiSelect v-model="visit.authorizedName" :options="store.visits"
                                    optionLabel="authorizedName" placeholder="اختر" emptySelectionMessage="ll"
                                    :selectionLimit="2" />
                                <label for="authorizedName">المخولين</label>

                                <error v-for="error in v$.authorizedName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="" v-model="visit.visitReason" :options="visitReason" optionLabel="name" />
                                <label for="visitReason">سبب الزيارة </label>
                                <error v-for="error in v$.visitReason.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">

                                <Calendar inputId="startVisit" v-model="visit.startVisit" dateFormat="yy/mm/dd"
                                    :showTime="true" selectionMode="single" :minDate="startDate" :showButtonBar="true"
                                    :manualInput="true" :stepMinute="5" hourFormat="12" @onChange="updateEndDate" />
                                <label for="startVisit">تاريخ بداية الزيارة </label>
                                <error v-for="error in v$.startVisit.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endVisit" v-model="visit.endVisit" dateFormat="yy/mm/dd" :showTime="true"
                                    selectionMode="single" :minDate="startDate" :showButtonBar="true" :manualInput="true"
                                    :stepMinute="5" hourFormat="12" />
                                <label for="endVisit">تاريخ انتهاء الزيارة </label>
                                <error v-for="error in v$.endVisit.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>


                        <div class="field col-6 md:col-3 lg:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="visit.visitDuration" :readonly="true" />
                                <label for="companionName"> مدة الزيارة </label>

                            </span>
                        </div>
                        <div class="field col-6 md:col-3 lg:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="visit.price" :readonly="true" />
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