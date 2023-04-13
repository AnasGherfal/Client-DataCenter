<script setup lang="ts">
import type { Representatives } from '@/views/Customers/modules/Representatives';
import { toNumber } from '@vue/shared';
import useVuelidate from '@vuelidate/core';
import { helpers, required, email } from '@vuelidate/validators';
import { computed, reactive, ref, defineEmits, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    representatives: {
        type: Object as () => Representatives,
        required: true
    },
    submitButtonText: {
        type: String,
        required: true
    },
    value:String
    
})

const representatives = ref(props.representatives)

const instance = getCurrentInstance()
const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        if (instance) {
            // Form submission logic here
            // You can access the form data via formData.value
            instance.emit('form-submit', representatives.value);
        }
    } else {
        console.log("empty")
    }
}

const rules = computed(() => {
    return {
        firstName: { required: helpers.withMessage('الاسم مطلوب', required) },
        lastName: { required: helpers.withMessage('الاسم مطلوب', required) },

        email: { required: helpers.withMessage('الايميل مطلوب', required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email) },
        phoneNo: { required: helpers.withMessage('رقم الهاتف مطلوب', required) },

    }
})
const v$ = useVuelidate(rules, representatives);



// const displayModal = ref(false);
// const openModal = () => {
//     displayModal.value = true;
// };



</script>
<template>


        


    <form @submit.prevent="submitForm">

        <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="representatives.firstName" />
                    <label for="name">الاسم </label>
                    <error v-for="error in v$.firstName.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</error>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="representatives.lastName" />
                    <label for="name">اللقب </label>
                    <error v-for="error in v$.lastName.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</error>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <InputText id="email" type="text" v-model="representatives.email" />
                    <label for="email">البريد الإلكتروني</label>
                    <error v-for="error in v$.email.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</error>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <InputMask v-model="representatives.phoneNo" mask="+218999999999" />
                    <label for="inputtext">رقم هاتف </label>
                    <error v-for="error in v$.phoneNo.$errors" :key="error.$uid" class="p-error">{{ error.$message }}</error>
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
        <Button type="submit" icon="pi pi-check" :label="value" />
    

    </form>

</template>