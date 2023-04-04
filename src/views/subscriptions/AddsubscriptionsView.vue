<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { required, helpers, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import BackButton from '@/components/BackButton.vue';
import {useCustomersStore} from '@/stores/customers'

const store = useCustomersStore();

const state = reactive({
    nameCustomer: "",
    startDate: '',
    endtDate: '',
    subscriptionType: '',
    File: '',

})

const rules = computed(() => {
    return {
        nameCustomer: { required: helpers.withMessage('الحقل مطلوب', required) },
        startDate: { required: helpers.withMessage('الحقل مطلوب', required) },
        endtDate: { required: helpers.withMessage(' الحقل مطلوب', required), minValue: helpers.withMessage('تاريخ انتهاء الاشتراك يجب ان يكون بعد تاريخ البدايه', minValue(state.startDate)) },
        subscriptionType: { required: helpers.withMessage('الحقل مطلوب', required) },
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تم الإشتراك', life: 3000 });
    }

}

const resetForm = () => {
    state.File = '',
        state.endtDate = '',
        state.startDate = '',
        state.nameCustomer = '',
        state.subscriptionType = ''
}

const minDate = ref(new Date());
const invalidDates = ref();



</script>


<template >
    <div>
        <Card>
            <template #title>

                إضافة اشتراك
                <BackButton style="float: left;"/>

                <Divider layout="horizontal" />
            </template>


            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label">
                                <AutoComplete v-model="state.nameCustomer" :suggestions="store.customers" optionLabel="nameCustomer" />
                                <label for="nameCustomer">اسم العميل </label>
                                <error v-for="error in v$.nameCustomer.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="startDate" v-model="state.startDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="startDate">تاريخ بداية الاشتراك</label>
                                <error v-for="error in v$.startDate.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Calendar inputId="endDate" v-model="state.endtDate" dateFormat="yy/mm/dd"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="false"
                                    :disabledDates="invalidDates" />
                                <label for="endtDate">تاريخ انتهاء الاشتراك</label>
                                <error v-for="error in v$.endtDate.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="subscriptionType" v-model="state.subscriptionType" placeholder="اختر الباقه"
                                    emptyMessage="لايوجد باقات" />
                                <label for="subscriptionType">الباقة</label>
                                <error v-for="error in v$.subscriptionType.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>
                        </div>

                        <div class="field col-12 md:col-6 lg:col-4" style="height: 1%;">
                            <FileUpload v-model="state.File"
                                style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                                mode="basic" name="File" url="./upload" chooseLabel=" ارفق ملف" cancelLabel="إلغاء"
                                :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                                invalidFileSizeMessage="Exceeded the maximum file size" />
                        </div>


                    </div>
                    <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5em;" />
                    <Toast position="bottom-right" />

                </form>
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
    color: #6c757d;
    transition-duration: 0.2s
}

/* .menuitem-content:hover {

} */
</style>