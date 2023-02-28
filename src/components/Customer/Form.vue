<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";

const state = reactive({
    name: "",
    email: "",
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',
    File: '',

})

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('الاسم مطلوب',required)},
    email: {required: helpers.withMessage('الايميل مطلوب',required), email: helpers.withMessage(' ليس عنوان بريد إلكتروني صالح', email)},
    address: {required: helpers.withMessage('العنوان مطلوب',required)},
    phoneNumber1: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
    phoneNumber2: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تمت إضافة العميل', life: 3000});
    }

        }

const resetForm = () => {
    state.name = '';
    state.email = '';
    state.phoneNumber1 = '';
    state.phoneNumber2 = '';
    state.address = '';
    state.File = '';


        }


</script>


<template>
    <div>
        <Card style="width: 70%; margin-left: 2em; margin-top: 2rem; border-radius: 10px;">
            <template #title>
                إضافة عميل
            </template>
            <template #content>
                <form @submit.prevent="submitForm">

                <div class="grid p-fluid ">
                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text" v-model="state.name"  />
                            <label  for="name">اسم العميل</label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>

                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputText id="email" type="text" v-model="state.email"  />
                            <label for="email">الايميل</label>
                            <error  v-for="error in v$.email.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputText id="inputtext" type="text" v-model="state.address" />
                            <label for="inputtext" >عنوان العميل</label>
                            <error  v-for="error in v$.address.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask v-model="state.phoneNumber1" mask="(999) 999-9999?" />
                            <label for="inputtext">رقم هاتف العميل</label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id="inputtext" v-model="state.phoneNumber2" mask="(999) 999-9999?" />
                            <label for="inputtext">رقم هاتف العميل</label>
                            <error  v-for="error in v$.phoneNumber2.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>
                    </div>

                    <div class="field col-12 md:col-4" style="height: 1%;">
                    <FileUpload 
                    mode="basic"
                     name="file[]" 
                     url="./upload" 
                     chooseLabel="ارفق ملف"
                     cancelLabel="إلغاء"
                     :showUploadButton="false"
                     :showCancelButton="false"
                     :maxFileSize="1000000"
                     invalidFileSizeMessage="Exceeded the maximum file size"
                     />
                     </div>


                </div>
                <Button @click="submitForm" icon="pi pi-check" label="إضافة" type="submit"   />
                <Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary" style="margin-left: .5em; background-color: red; " />
                <Toast position="bottom-right" />

            </form>
            </template>
            

        </Card>
    </div>
</template>

<style>
.p-card-title{
    text-align: right;

}

.p-inputtext	{
    text-align: right;
    border-radius: 10px;
}
.p-inputtext-filled	{
    text-align: right;
    align-items: end;
    align-content: end;

}
error{
    font-size: 12px; 
    font-weight: bold;
}


</style>