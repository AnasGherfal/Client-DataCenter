<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useUsersStore } from '@/stores/users';


const store = useUsersStore();

const state = reactive({
    CustomerName: "",
    authorizedName: "",
    companionName: "",
    visitReason: "",
    expectedStartVisit:"" ,
    expectedEndVisit:  "",
    visitDuration: "ساعه",
    price: "100دينار",
})

const minDate = ref(new Date());
const visitReason = ref([
    { name: 'صيانه' },
    { name: 'انهاء عمل' },
])


let today = new Date();
let hours = today.getHours();



  
 

const invalidDates = ref();

const filterdUsers = ref();

const searchUsers = () => {

}

const rules = computed(() => {
    return {
        CustomerName: { required: helpers.withMessage('اسم العميل مطلوب', required) },
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
    state.CustomerName = '';
    state.authorizedName = '';
    state.companionName = '';
    state.visitReason = "";
    state.expectedStartVisit = "";
    state.expectedEndVisit =  "",
        state.visitDuration = "",
        state.price = ""
}

</script>

<template >
    <div>{{  }}
        <Card>
            <template #title>
                إنشاء زيارة
            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                    <div class="grid p-fluid ">

                        <div class="field col-12 md:col-4 ">
                            <span class="p-float-label">
                                <MultiSelect v-model="state.CustomerName" :options="store.users" optionLabel="name" :filter="true"
                                 placeholder=" اختر عميل" 
                                 :selectionLimit="1" />
                                <label for="CustomerName">العملاء</label>

                                <error v-for="error in v$.CustomerName.$errors" :key="error.$uid" class="p-error">{{
                                    error.$message }}</error>

                            </span>

                        </div>

                        <div class="field col-12 md:col-4 ">
                            <span class="p-float-label">
                                <MultiSelect v-model="state.authorizedName" :options="store.users" optionLabel="email" placeholder="اختر" 
                                emptySelectionMessage="ll" :selectionLimit="2" />
                                <label for="authorizedName">المخولين</label>

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

                                <Calendar inputId="expectedStartVisit" v-model="state.expectedStartVisit" dateFormat="yy/mm/dd" :showTime="true"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="true" 
                                    :stepMinute="5" hourFormat="12" :disabledDates="invalidDates" />
                                <label for="expectedStartVisit">تاريخ بداية الزيارة المتوقع</label>
                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">

                                <Calendar inputId="expectedEndVisit" v-model="state.expectedEndVisit" dateFormat="yy/mm/dd" :showTime="true"
                                    selectionMode="single" :minDate="minDate" :showButtonBar="true" :manualInput="true" 
                                    :stepMinute="5" hourFormat="12" :disabledDates="invalidDates" />
                                <label for="expectedEndVisit">تاريخ انتهاء الزيارة المتوقع</label>
                            </span>
                        </div>

                        <div class="field col-12 md:col-4">
                            <span class="p-float-label ">
                                <Dropdown id="" v-model="state.visitReason" :options="visitReason" optionLabel="name" />
                                <label for="phoneNum1">سبب الزيارة </label>

                            </span>
                        </div>

                        <div class="field col-12 md:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.visitDuration" :readonly="true" />
                                <label for="companionName"> مدة الزيارة </label>

                            </span>
                        </div>
                        <div class="field col-12 md:col-2">
                            <span class="p-float-label ">
                                <InputText id="companionName" v-model="state.price" :readonly="true" />
                                <label for="companionName"> السعر </label>

                            </span>
                        </div>
                        

                    </div>

                    <h3>إضافة مرافق </h3>

                    <Button @click="submitForm" icon="pi pi-check" label="إضافة" type="submit" />
                    <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-secondary"
                        style="margin-right: .5rem;  background-color: red;" />
                    <Toast position="bottom-right" />

                </form>
            </template>



        </Card>
    </div>
</template>
<style >
.p-button-icon {
    padding-left: 0;
}





</style>