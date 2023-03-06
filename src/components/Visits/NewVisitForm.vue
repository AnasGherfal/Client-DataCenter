<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";

const state = reactive({
    userName: "",
    authorizedName: "",
    companionName: "",
    visitReason: "",
    visitDate: "",
    expectedStartTime: "",
    expectedEndTime: "",
    visitDuration: "ساعه",
    price: "100دينار",


})

const minDate = ref(new Date());
const visitReason = ref([
{name: 'صيانه'},
            {name: 'انهاء عمل'},
])

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();

const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {

}

const rules = computed(() => {
    return {
        userName: { required: helpers.withMessage('اسم العميل مطلوب', required) },
        authorizedName: { required: helpers.withMessage('رقم المخول مطلوب', required) },
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if (result) {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'تمت إضافة زيارة', life: 3000 });
    }

}

const resetForm = () => {
    state.userName = '';
    state.authorizedName = '';
    state.companionName = '';
    state.visitReason = "";
    state.visitDate = "";
    state.expectedStartTime = '';
    state.expectedEndTime = "",
    state.visitDuration = "",
    state.price = ""
}




</script>


<template >
    <div>
        <Card>
            <template #title>
                إنشاء زيارة
            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">
                        <div class="field col-12 md:col-4 ">
                            <span class="p-float-label">
                                <AutoComplete id='userName' v-model="state.userName" :suggestions="filterdUsers"
                                    @complete="searchUsers()" :dropdown="true" optionLabel="name" forceSelection />
                                <label for="userName">اسم العميل</label>
                                <error v-for="error in v$.userName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-4 ">
                            <span class="p-float-label">
                                <Dropdown id="authorizedName" type="text" v-model="state.authorizedName" />
                                <label for="authorizedName">اسم المخول </label>
                                <error v-for="error in v$.authorizedName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>
                            </span>

                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.companionName" />
                                <label for="companionName"> اسم المرافق </label>

                            </span>
                        </div>                   


                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">

                                <Calendar inputId="visitDate" v-model="state.visitDate" dateFormat="yy/mm/dd" selectionMode="single" :minDate="minDate"
                                     :showButtonBar="true" :manualInput="false" :disabledDates="invalidDates" />
                                    <label for="visitDate">تاريخ الزيارة</label>
                            </span>
                        </div>

                        <div  class="field col-12 md:col-4">
                            <span class="p-float-label ">

                <Calendar inputId="expectedStartTime" v-model="state.expectedStartTime" :showTime="true" hourFormat="24" :timeOnly="true" :stepMinute="5"/>
                <label for="expectedStartTime">وقت بداية الزيارة</label>

                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                <Calendar inputId="time24" v-model="state.expectedEndTime" :showTime="true" hourFormat="24" :timeOnly="true"  />
                <label for="time24">وقت انتهاء الزيارة</label>

                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Dropdown id=""  v-model="state.visitReason" :options="visitReason" optionLabel="name"/>
                                <label for="phoneNum1">سبب الزيارة </label>

                            </span>
                        </div>

                        <div class="field col-12 md:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.visitDuration" :readonly="true" />
                                <label for="companionName"> مدة الزيارة  </label>

                            </span>
                        </div>    
                        <div class="field col-12 md:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.price" :readonly="true" />
                                <label for="companionName"> السعر  </label>

                            </span>
                        </div>   




                    </div>


                    <Button @click="submitForm" icon="pi pi-check" label="إضافة" type="submit" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-secondary"
                        style="margin-right: .5rem;  background-color: red;" />
                    <Toast position="bottom-right" />

                </form>
            </template>



        </Card>
    </div>
</template>
<style>

.p-datepicker.p-datepicker-timeonly .p-timepicker {
    border-top: 0 none;
    direction: ltr;
}

</style>