<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { email, required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import InputText from 'primevue/inputtext';
import BackButton from '@/components/BackButton.vue';
import type { Customer } from '@/views/Customers/modules/Customers';
import { isLibyanPhoneNumber, validateText } from '@/assets/validations';
import AddCustomer from '@/views/Customers/AddCustomer.vue';
import InfoCustomer from '@/views/Customers/Profile/InfoCustomer.vue';

const loading = ref(false);

const props = defineProps({
    customers: {
        type: Object as () => Customer,
        required: true
    },
    submitButtonText: {
        type: String,
    },
    value: String,




})

const toast = useToast();

const customers = ref(props.customers)


const rules = computed(() => {
    return {
        name: {
            required: helpers.withMessage('الحقل مطلوب', required),
            validateText: helpers.withMessage(', حروف عربيه او انجليزيه فقط', validateText),
            minLength: helpers.withMessage('يجب أن يحتوي على الأقل 3 أحرف', minLength(3)),

        },
        email: {
            required: helpers.withMessage('الحقل مطلوب', required),
            email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)
        },
        address: { required: helpers.withMessage('الحقل مطلوب', required) },
        primaryPhone: {
            required: helpers.withMessage('الحقل مطلوب', required),
            isLibyanPhoneNumber: helpers.withMessage(' , ليس رقم ليبي صالح', isLibyanPhoneNumber)
        },
    }
})
const v$ = useVuelidate(rules, customers);

const instance = getCurrentInstance()

const submitForm = async () => {
    const result = await v$.value.$validate();
    try {
        if (result) {
            if (instance) {
                // Form submission logic here

                instance.emit('form-submit', customers.value);
            }
        } else {
            toast.add({ severity: 'error', summary: 'رسالة خطأ', detail: 'يرجى تعبئة الحقول', life: 3000 })
        }
    } catch (error) {
        console.log(error)

    }
}

const isDisabled = ref(true);



</script>

<template>
    <div>

        <form @submit.prevent="submitForm" >

            <div class="grid p-fluid ">
                <div class=" field col-12 md:col-6 lg:col-4 ">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="customers.name "  />
                        <div style="height: 10px;">
                            <error v-for="error in v$.name.$errors" :key="error.$uid" class="p-error ">
                                {{ error.$message }}</error>
                        </div>

                        <label for="name">اسم </label>
                    </span>

                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputText id="email" type="text" v-model="customers.email" />
                        <label for="email">البريد الإلكتروني</label>
                        <div style="height: 10px;">
                            <error v-for="error in v$.email.$errors" :key="error.$uid" class="p-error">
                                {{ error.$message }}</error>
                        </div>

                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputText id="address" type="text" v-model="customers.address" />
                        <label for="address">العنوان</label>
                        <div style="height: 10px;">
                            <error v-for="error in v$.address.$errors" :key="error.$uid" class="p-error">
                                {{ error.$message }}</error>
                        </div>

                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputMask id="phoneNum1" v-model="customers.primaryPhone" mask="+218999999999"
                             />
                        <label for="phoneNum1">رقم هاتف </label>
                        <div style="height: 10px;">
                            <error v-for="error in v$.primaryPhone.$errors" :key="error.$uid" class="p-error">
                                {{ error.$message }}</error>
                        </div>
                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputMask id="secondaryPhone" v-model="customers.secondaryPhone" mask="+218999999999"
                             />
                        <label for="secondaryPhone">رقم هاتف 2</label>
                    </span>
                </div>


                <div class="field col-12 md:col-6 lg:col-4">
                    <FileUpload
                        style=" width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                        mode="basic" v-model="customers.file" name="File" url="./upload" chooseLabel=" ارفق ملف"
                        cancelLabel="إلغاء" :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                        invalidFileSizeMessage="Exceeded the maximum file size" />
                </div>
            </div>
            <Button @click="submitForm" icon="fa-solid fa-plus" label="إضافة" :loading="loading" />
            <!-- <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger" -->
            <!-- style="margin-right: .5em;" /> -->
            <Toast position="bottom-left" />

        </form>
    </div>
</template>