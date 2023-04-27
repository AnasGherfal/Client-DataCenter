<script setup lang="ts">
import { computed, reactive, ref, type PropType } from 'vue';
import { useToast } from "primevue/usetoast";
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';
import type { Customer } from '../modules/Customers';
import CustomerForm from '@/components/Customers/CustomerForm.vue';
import { email, helpers, minLength, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { isLibyanPhoneNumber, validateText } from '@/assets/validations';

const actEdit = ref(true);

const dataClinet = defineProps<{ customer: any }>()

const customers: Customer = reactive({
    name: dataClinet.customer.name,
    email: dataClinet.customer.email,
    primaryPhone: dataClinet.customer.primaryPhone,
    secondaryPhone: dataClinet.customer.secondaryPhone,
    address: dataClinet.customer.address,

})

const toast = useToast();

const onFormSubmit = async () => {
    const result = await v$.value.$validate();

    try {
        if (result) {

        const response = await axios.put("https://localhost:7003/api/Customers/" + dataClinet.customer.id, customers)
        toast.add({ severity: 'success', summary: 'رسالة نجاح', detail: response.data, life: 3000 });
        actEdit.value = true;
    } else {
            toast.add({ severity: 'error', summary: 'رسالة خطأ', detail: 'يرجى تعبئة الحقول', life: 3000 })
        }
    } catch (error) {
        console.log(error);

    }

}

const isDisabled = ref(true)
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

</script>


<template >
    <div>
        <Card>
            <template #title>
                البيانات الشخصية

                <BackButton style="float: left;" />

                <Button v-if="actEdit" @click="actEdit = !actEdit" icon=" fa-solid fa-pen"
                    style="width: 30px;height: 30px; margin-right: 10px;" class=" p-button-primary p-button-text"
                    v-tooltip="{ value: 'تعديل البيانات الشخصية', fitContent: true }" />

                <Divider />

            </template>
            <template #content>
                <div>


                    <div>
                        <form @submit.prevent="onFormSubmit" :disabled="actEdit">

                            <div class="grid p-fluid ">
                <div class=" field col-12 md:col-6 lg:col-4 ">
                    <span class="p-float-label">
                        <InputText id="name" type="text" v-model="customers.name " :disabled="actEdit"  />
                        <div style="height: 10px;">
                            <span  v-for="error in v$.name.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;" >
                                {{ error.$message }}</span>
                        </div>

                        <label for="name">اسم </label>
                    </span>

                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputText id="email" type="text" v-model="customers.email" :disabled="actEdit"/>
                        <label for="email">البريد الإلكتروني</label>
                        <div style="height: 10px;">
                            <span v-for="error in v$.email.$errors" :key="error.$uid" 
                            style="color: red; font-weight: bold; font-size: small;">
                                {{ error.$message }}</span>
                        </div>

                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputText id="address" type="text" v-model="customers.address" :disabled="actEdit"/>
                        <label for="address">العنوان</label>
                        <div style="height: 10px;">
                            <span v-for="error in v$.address.$errors" :key="error.$uid" 
                            style="color: red; font-weight: bold; font-size: small;">
                                {{ error.$message }}</span>
                        </div>

                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputMask id="phoneNum1" v-model="customers.primaryPhone" mask="+218999999999"
                            style="direction: ltr; text-align: end;" :disabled="actEdit"/>
                        <label for="phoneNum1">رقم هاتف </label>
                        <div style="height: 10px;">
                            <span v-for="error in v$.primaryPhone.$errors" :key="error.$uid"
                            style="color: red; font-weight: bold; font-size: small;">
                                {{ error.$message }}</span>
                        </div>
                    </span>
                </div>
                <div class="field col-12 md:col-6 lg:col-4">
                    <span class="p-float-label ">
                        <InputMask id="secondaryPhone" v-model="customers.secondaryPhone" mask="+218999999999"
                        :disabled="actEdit"/>
                        <label for="secondaryPhone">رقم هاتف 2</label>
                    </span>
                </div>


                <div class="field col-12 md:col-6 lg:col-4">
                    <FileUpload
                        style=" width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                        mode="basic" v-model="customer.file" name="File" url="./upload" chooseLabel=" ارفق ملف"
                        cancelLabel="إلغاء" :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                        invalidFileSizeMessage="Exceeded the maximum file size" />
                </div>
            </div>

                        </form>

                    </div>

                    <div v-if="!actEdit">
                        <Button @click="onFormSubmit" icon="fa-solid fa-check" label="تعديل" />
                        <Button @click="actEdit = !actEdit" icon="fa-solid fa-ban" label="إلغاء التعديل"
                            class="p-button-danger" style="margin-right: .5em;" />
                    </div>
                    <Toast position="bottom-left" />


                </div>
            </template>


        </Card>

    </div>
</template>


<style>
error {
    font-size: 12px;
    font-weight: bold;
}

.p-dropdown {
    border-radius: 10px;
}

.p-float-label>label {
    right: 0.5rem;
    transition-duration: 0.3s
}


.p-button:enabled:hover {
    background: #0d89ec;
    color: #ffffff;
    border-color: #0d89ec;
}
</style>