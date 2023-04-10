<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useVistisStore } from '@/stores/visits';
import addCompanion from './addCompanion.vue';
import router from '@/router';
import type { Visit } from './modules/VisitModule'
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';

const store = useVistisStore();
const data = defineProps<{ customer: any }>();
const editable = ref(true);

const visit: Visit = reactive({
    customerName: data.customer.name,
    authorizedName: data.customer.authorizedName,
    companionName: data.customer.companionName,
    visitReason: data.customer.visitReason,
    startVisit: data.customer.startVisit,
    endVisit: data.customer.endVisit,
    visitDuration: data.customer.visitDuration,
    price: data.customer.price,
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
const startDate = ref(new Date());

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

const v$ = useVuelidate(rules, visit);

const submitForm = async () => {
    const result = await v$.value.$validate();


    // if (result) {
    //     axios.put(`http://localhost:3000/visits${data.customer.id, visit}`)
    //         .then(function (response) {
    //             editable.value = true;
    //             toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });


    //         })
    //         .catch(function (error) {
    //             console.log(error)

    //         })

    // } else {
    //     console.log("empty")
    // }

}


function backButton() {
    router.go(-1)
}

</script>

<template >
    <div>
        <Card>

            <template #title>

                تفاصيل الزيارة
                <BackButton style="float: left;" />

                <Button v-if="editable" @click="editable = !editable" icon=" fa-solid fa-pen"
                    style="width: 30px;height: 30px; margin-right: 10px;" class=" p-button-primary p-button-text"
                    v-tooltip="{ value: 'تعديل بيانات الزيارة', fitContent: true }" />


            </template>
            <template #content>
                <div>
                    <form @submit.prevent="submitForm">


                        <div class="grid p-fluid ">

                            <div class="field col-12 md:col-6 lg:col-4">
                                <span class="p-float-label">
                                    <InputText v-model="visit.customerName" optionLabel="name" placeholder=" اختر عميل"
                                        :disabled="editable" />
                                    <label for="customerName">العميل</label>


                                </span>
                            </div>

                            <div class="field col-12 md:col-6 lg:col-4">
                                <span class="p-float-label">
                                    <InputText id="name" type="text" v-model="visit.authorizedName" :disabled="editable" />
                                    <label style="color: black;top: -.75rem; font-size: 12px;" for="authorizedName">
                                        المخوليين
                                    </label>

                                </span>
                            </div>

                            <div class="field col-12 md:col-6 lg:col-4">
                                <span class="p-float-label">
                                    <InputText id="name" type="text" v-model="visit.visitReason" :disabled="editable" />
                                    <label style="color: black;top: -.75rem; font-size: 12px;" for="authorizedName">سبب
                                        الزيارة </label>

                                </span>
                            </div>

                            <div class="field col-12 md:col-6 lg:col-4">
                                <span class="p-float-label">

                                    <Calendar inputId="startVisit" v-model="visit.startVisit" dateFormat="yy/mm/dd"
                                        :showTime="true" selectionMode="single" :minDate="startDate" :showButtonBar="true"
                                        :manualInput="true" :stepMinute="5" hourFormat="12" :disabled="editable" />
                                    <label for="startVisit">تاريخ بداية الزيارة </label>

                                </span>
                            </div>

                            <div class="field col-12 md:col-6 lg:col-4">
                                <span class="p-float-label">

                                    <Calendar inputId="startVisit" v-model="visit.endVisit" dateFormat="yy/mm/dd"
                                        :showTime="true" selectionMode="single" :minDate="startDate" :showButtonBar="true"
                                        :manualInput="true" :stepMinute="5" hourFormat="12" :disabled="editable" />
                                    <label for="startVisit">تاريخ انتهاء الزيارة </label>

                                </span>
                            </div>

                            <div class="field col-6 md:col-3 lg:col-2">
                                <span class="p-float-label ">
                                    <InputText id="companionName" v-model="visit.visitDuration" :readonly="true"
                                        :disabled="true" />
                                    <label for="companionName"> مدة الزيارة </label>

                                </span>
                            </div>

                            <div class="field col-6 md:col-3 lg:col-2">
                                <span class="p-float-label ">
                                    <InputText id="companionName" v-model="visit.price" :readonly="true" :disabled="true" />
                                    <label for="companionName"> السعر </label>
                                </span>
                            </div>
                        </div>

                    </form>

                    <div v-if="!editable">
                        <Button @click="submitForm" icon="fa-solid fa-check" label="تعديل" type="submit" />
                        <Button @click="editable = !editable" icon="fa-solid fa-ban" label="إلغاء التعديل"
                            class="p-button-danger" style="margin-right: .5em;" />
                    </div>
                </div>


            </template>
        </Card>
    </div>
</template>