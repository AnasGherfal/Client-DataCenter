<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import type { Representatives } from '../modules/Representatives';
import axios from 'axios';
import { RouterLink, routerKey, useRoute } from 'vue-router';
import { toNumber } from '@vue/shared';


const route = useRoute()

const userId = computed(() => {
    if (route && route.params && route.params.id) {
        return route.params.id
    } else {
        return null // or return a default value if id is not available
    }
})

const emit = defineEmits(['getRepresentatives'])
const representatives: Representatives = reactive({
    firstName: "",
    lastName: "",
    identityNo: "",
    email: "",
    phoneNo: "",
    identityType: null, //1 personalId 2-authorized 3-representitive
    customerId: toNumber(userId)


})

const rules = computed(() => {
    return {
        firstName: { required: helpers.withMessage('الاسم مطلوب', required) },
        lastName: { required: helpers.withMessage('الاسم مطلوب', required) },

        email: { required: helpers.withMessage('الايميل مطلوب', required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email) },
        phoneNo: { required: helpers.withMessage('رقم الهاتف مطلوب', required) },

    }
})

const toast = useToast();

const v$ = useVuelidate(rules, representatives);

const submitForm = async () => {
    const result = await v$.value.$validate();
    if (result) {
        console.log('1')
        axios.post("https://localhost:7003/api/Representives", representatives)
            .then(function (response) {

                emit('getRepresentatives')
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة باقة', life: 3000 });
            })
            .catch(function (error) {
                console.log(error)
                toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'هناك مشكلة في عملية الادخال', life: 3000 });
            })
        resetForm();
        displayModal.value = false;


    } else {
        console.log("empty")
    }
}


const resetForm = () => {
    representatives.firstName = '';
    representatives.lastName = '';

    representatives.email = '';
    representatives.phoneNo = '';
    representatives.identityNo = '';
    representatives.identityType = null;
}

const displayModal = ref(false);

const openModal = () => {
    displayModal.value = true;
};
const closeModal = () => {
    displayModal.value = false;
}
</script>


<template >
    <div>
        <Dialog header="اضافة مُخول" contentStyle="height: 280px; padding: 20px;" v-model:visible="displayModal"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '60vw' }" :modal="true">


            <template #default>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <InputText id="name" type="text" v-model="representatives.firstName" />
                                <label for="name">الاسم </label>
                                <error v-for="error in v$.firstName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>

                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <InputText id="name" type="text" v-model="representatives.lastName" />
                                <label for="name">اللقب </label>
                                <error v-for="error in v$.lastName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>

                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="email" type="text" v-model="representatives.email" />
                                <label for="email">البريد الإلكتروني</label>
                                <error v-for="error in v$.email.$errors" :key="error.$uid" class="p-error">{{ error.$message
                                }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputMask v-model="representatives.phoneNo" mask="+218999999999" />
                                <label for="inputtext">رقم هاتف </label>
                                <error v-for="error in v$.phoneNo.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="inputtext" type="text" v-model="representatives.identityType" />
                                <label for="inputtext">نوع الاثبات</label>

                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="inputtext" v-model="representatives.identityNo" />
                                <label for="inputtext">رقم الاثبات </label>
                            </span>
                        </div>



                    </div>
                    <Button @click="submitForm" icon="pi pi-check" label="إضافة" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5rem;" />

                </form>
            </template>


        </Dialog>
        <Button @click="openModal" class=" p-button-primary mb-4">
            اضافة مُخول
        </Button>
    </div>
</template>

<style>
.p-card-title {
    text-align: right;

}

.p-inputtext {
    text-align: right;
    border-radius: 10px;
}

.p-inputtext-filled {
    text-align: right;
    align-items: end;
    align-content: end;

}

error {
    font-size: 12px;
    font-weight: bold;
}
</style>