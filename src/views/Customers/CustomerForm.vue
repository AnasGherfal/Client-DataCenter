<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers'
import axios from 'axios';
import router from '@/router';
import InputText from 'primevue/inputtext';
import BackButton from '@/components/BackButton.vue';
import type { Customer } from './modules/Customers';
import { isLibyanPhoneNumber, validateText } from '@/assets/validations';

const store = useCustomersStore();
const loading = ref(false);

const customer: Customer = reactive({
    name: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    address: '',
    file: null
});


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


const v$ = useVuelidate(rules, customer);

async function submitForm() {
    try {
        const result = await v$.value.$validate();
        if (result) {
            setTimeout(() => {
                router.go(-1)
                loading.value = false;

            }, 1000);
            loading.value = true;
            const response = await axios.post("https://localhost:7003/api/Customers", customer);
            toast.add({ severity: 'success', summary: 'رسالة نجاح', detail: response.data.msg, life: 3000 });
            store.getdata();
            loading.value = false;
        } else {
            toast.add({ severity: 'error', summary: 'رسالة خطأ', detail:'يرجى تعبئة الحقول', life: 3000 })
        }
    } catch (error) {
        console.log(error);
    }
}

const toast = useToast();

const resetForm = () => {
    customer.name = '';
    customer.email = '';
    customer.primaryPhone = '';
    customer.secondaryPhone = '';
    customer.address = '';
    customer.file = null;
}

</script>


<template >
    <div>
        <Card>

            <template #title>

                إضافة عميل

                <BackButton style="float: left;" />

                <Divider />

            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">
                        <div class=" field col-12 md:col-6 lg:col-4 ">
                            <span class="p-float-label">
                                <InputText id="name" type="text" v-model="customer.name" />
                                <div style="height: 10px;">
                                    <error v-for="error in v$.name.$errors" :key="error.$uid" class="p-error ">
                                        {{ error.$message }}</error>
                                </div>

                                <label for="name">اسم </label>
                            </span>

                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">{{ }}
                                <InputText id="email" type="text" v-model="customer.email" />
                                <label for="email">البريد الإلكتروني</label>
                                <div style="height: 10px;">
                                    <error v-for="error in v$.email.$errors" :key="error.$uid" class="p-error">
                                        {{ error.$message }}</error>
                                </div>

                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="address" type="text" v-model="customer.address" />
                                <label for="address">العنوان</label>
                                <div style="height: 10px;">
                                    <error v-for="error in v$.address.$errors" :key="error.$uid" class="p-error">
                                        {{ error.$message }}</error>
                                </div>

                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputMask id="phoneNum1" v-model="customer.primaryPhone" mask="+218999999999" />
                                <label for="phoneNum1">رقم هاتف </label>
                                <div style="height: 10px;">
                                    <error v-for="error in v$.primaryPhone.$errors" :key="error.$uid" class="p-error">
                                        {{ error.$message }}</error>
                                </div>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputMask id="secondaryPhone" v-model="customer.secondaryPhone" mask="+218999999999" />
                                <label for="secondaryPhone">رقم هاتف 2</label>
                            </span>
                        </div>


                        <div class="field col-12 md:col-6 lg:col-4">
                            <FileUpload
                                style=" width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                                mode="basic" v-model="customer.file" name="File" url="./upload" chooseLabel=" ارفق ملف"
                                cancelLabel="إلغاء" :showUploadButton="false" :showCancelButton="false"
                                :maxFileSize="1000000" invalidFileSizeMessage="Exceeded the maximum file size" />
                        </div>
                    </div>
                    <Button @click="submitForm" icon="fa-solid fa-plus" label="إضافة" :loading="loading" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5em;" />
                    <Toast position="bottom-left" />

                </form>
            </template>


        </Card>

    </div>
</template>
<style scoped>
.p-button-icon {
    padding-left: 0.5rem;
}

.p-inputmask p-inputtext {
    direction: rtl;
}

.p-float-label>label {
    right: 0.5rem;
    transition-duration: 0.3s
}

.p-fluid .p-inputtext {
    width: 100%;
    direction: ltr;
}

/* .menuitem-content:hover {

} */
</style>