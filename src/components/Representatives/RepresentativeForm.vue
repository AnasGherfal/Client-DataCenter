<script setup lang="ts">
import type { Representatives } from '@/views/Customers/modules/Representatives';
import useVuelidate from '@vuelidate/core';
import { helpers, required, email, minLength } from '@vuelidate/validators';
import { computed, reactive, ref, defineEmits, getCurrentInstance, watch, provide } from 'vue';
import { isLibyanPhoneNumber, validateText } from '@/assets/validations';
import { useToast } from "primevue/usetoast";

const props = defineProps({
    representatives: {
        type: Object as () => Representatives,
        required: true
    },
    submitButtonText: {
        type: String,
        required: true
    },
    value: String

})
const toast = useToast();
const loading = ref(false);

const representatives = ref(props.representatives)

const instance = getCurrentInstance()
const onSubmitForm = async () => {
    const result = await v$.value.$validate();
    try {
        if (result) {
            loading.value = true;
            if (instance) {
                // Form submission logic here

                instance.emit('form-submit', representatives.value);
            }
        } else {
            toast.add({
                severity: 'error',
                summary: 'رسالة خطأ',
                detail: 'يرجى تعبئة الحقول',
                life: 3000
            })
        }
    } catch (error) {
        console.log(error)

    }
}

const rules = computed(() => {
    return {
        firstName: {
            required: helpers.withMessage('الحقل مطلوب', required),
            validateText: helpers.withMessage(', حروف عربيه او انجليزيه فقط', validateText),
            minLength: helpers.withMessage('يجب أن يحتوي على الأقل 3 أحرف', minLength(3)),
        },
        lastName: {
            required: helpers.withMessage('الحقل مطلوب', required),
            validateText: helpers.withMessage(', حروف عربيه او انجليزيه فقط', validateText),
            minLength: helpers.withMessage('يجب أن يحتوي على الأقل 3 أحرف', minLength(3)),
        },

        email: {
            required: helpers.withMessage('الحقل مطلوب', required),
            email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)
        },
        phoneNo: {
            required: helpers.withMessage('الحقل مطلوب', required),
            isLibyanPhoneNumber: helpers.withMessage(' , ليس رقم ليبي صالح', isLibyanPhoneNumber)
        },

    }
})
const v$ = useVuelidate(rules, representatives);



// const displayModal = ref(false);
// const openModal = () => {
//     displayModal.value = true;
// };
type IdentityTypeOption = {
    value: number;
    text: string;
};
// Array of identity type options
const identityTypeOptions: IdentityTypeOption[] = [
    { value: 1, text: 'اثبات هويه' },
    { value: 2, text: 'جواز سفر' },
];



const selectedIdentityTypeText = computed(() => {
    const selectedValue = representatives.value.identityType;
    const selectedOption = identityTypeOptions.find(
        option => option.value === selectedValue
    );
    return selectedOption ? selectedOption.text : '';

});




</script>
<template>
    <form @submit.prevent="onSubmitForm">

        <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="representatives.firstName" />
                    <label for="name">الاسم </label>
                    <div style="height: 10px;">
                        <span v-for="error in v$.firstName.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;">
                            {{ error.$message }}
                        </span>
                    </div>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label">
                    <InputText id="name" type="text" v-model="representatives.lastName" />
                    <label for="name">اللقب </label>
                    <div style="height: 10px;">
                        <span v-for="error in v$.lastName.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;">
                            {{ error.$message }}
                        </span>
                    </div>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <InputText id="email" type="text" v-model="representatives.email" />
                    <label for="email">البريد الإلكتروني</label>
                    <div style="height: 10px;">
                        <span v-for="error in v$.email.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;">
                            {{ error.$message }}
                        </span>
                    </div>
                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <InputMask v-model="representatives.phoneNo" mask="+218999999999" style="direction: ltr" />
                    <label for="inputtext">رقم هاتف </label>
                    <div style="height: 10px;">
                        <span v-for="error in v$.phoneNo.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;">
                            {{ error.$message }}
                        </span>
                    </div>

                </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <Dropdown v-model="representatives.identityType" :options="identityTypeOptions" optionValue="value"
                        optionLabel="text" placeholder=" نوع الاثبات" />

                </span>

            </div>
            <div class="field col-12 md:col-6 lg:col-4">
                <span class="p-float-label ">
                    <InputText id="inputtext" v-model="representatives.identityNo" />
                    <label for="inputtext">رقم الاثبات </label>
                </span>
            </div>
        </div>
        <Button type="submit" icon="pi pi-check" :label="value" :loading="loading"/>
        <toast />

    </form>
</template>