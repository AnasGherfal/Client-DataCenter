<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers'
import axios from 'axios';
import router from '@/router';
import InputText from 'primevue/inputtext';


const store = useCustomersStore();


// const rules = computed(() => {
//     return {
//         name: { required: helpers.withMessage('الاسم مطلوب', required) },
//         email: { required: helpers.withMessage('الايميل مطلوب', required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email) },
//         address: { required: helpers.withMessage('العنوان مطلوب', required) },
//         primaryPhone: { required: helpers.withMessage('الحقل مطلوب', required), isLibyanPhoneNumber: helpers.withMessage(' , ليس رقم ليبي صالح', isLibyanPhoneNumber) },
//     }
// })

// function isLibyanPhoneNumber(input: string): boolean {
//     const phoneRegex = /^(?:\+?218)(?:(?:91|92|94|95)\d{7})$/;
//     return phoneRegex.test(input);
// }

const toast = useToast();

// const v$ = useVuelidate(rules, store.state);

// const submitForm = async () => {

//     const result = await v$.value.$validate();
//     if (result) {
//         loading.value = true;
//         setTimeout(() => {

//             loading.value = false;
//             router.go(-1)

//         }, 2000);


//         axios.post("https://localhost:7003/api/Customers", state)
//             .then(function (response) {
//                 console.log(response)
//                 console.log(state)
//                 data.value= response

//             })
//             .catch(function (error) {
//                 console.log(error)
//             })
//         toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة العميل', life: 3000 });

//     } else {
//         console.log("empty")
//     }
// }

function backButton() {
    router.go(-1)
}
const loading = ref(false);


const resetForm = () => {
    store.state.name = '';
    store.state.email = '';
    store.state.primaryPhone = '';
    store.state.secondaryPhone = '';
    store.state.address = '';
    store.state.file = '';
}


</script>


<template >
    <div>
        <Card>

            <template #title>

                إضافة عميل

                <Button @click="backButton" icon="fa-solid   fa-arrow-left fa-shake-hover" rounded aria-label="Filter"
                    style="float: left;" />

                <Divider />

            </template>
            <template #content>
                <form @submit.prevent="store.submitForm">

                    <div class="grid p-fluid ">
                        <div class=" field col-12 md:col-6 lg:col-4 ">
                            <span class="p-float-label">
                                <InputText id="name" type="text" v-model="store.state.name" />
                                <error v-for="error in store.v$.name.$errors" :key="error.$uid" class="p-error ">
                                    {{ error.$message }}</error>
                                <label for="name">اسم </label>
                            </span>

                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="email" type="text" v-model="store.state.email" />
                                <label for="email">البريد الإلكتروني</label>
                                <error v-for="error in store.v$.email.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputText id="address" type="text" v-model="store.state.address" />
                                <label for="address">العنوان</label>
                                <error v-for="error in store.v$.address.$errors" :key="error.$uid" class="p-error">
                                    {{ error.$message }}</error>

                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputMask id="phoneNum1" v-model="store.state.primaryPhone" mask="+218999999999" />
                                <label for="phoneNum1">رقم هاتف </label>
                                <error v-for="error in store.v$.primaryPhone.$errors" :key="error.$uid" class="p-error">
                                    {{ error.$message }}</error>
                            </span>
                        </div>
                        <div class="field col-12 md:col-6 lg:col-4">
                            <span class="p-float-label ">
                                <InputMask id="secondaryPhone" v-model="store.state.secondaryPhone" mask="+218999999999" />
                                <label for="secondaryPhone">رقم هاتف 2</label>
                            </span>
                        </div>


                        <div class="field col-12 md:col-6 lg:col-4">
                            <FileUpload
                                style="font-family: tajawal; width: 100%; height: 40px; border-radius: 10px; background-color: white; color:black; border-color: gray"
                                mode="basic" name="File" url="./upload" chooseLabel=" ارفق ملف" cancelLabel="إلغاء"
                                :showUploadButton="false" :showCancelButton="false" :maxFileSize="1000000"
                                invalidFileSizeMessage="Exceeded the maximum file size" />
                        </div>

                    </div>
                    <Button @click="store.submitForm" icon="fa-solid fa-plus" label="إضافة"  :loading="store.loading" />

                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-danger"
                        style="margin-right: .5em;" />
                    <Toast />

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