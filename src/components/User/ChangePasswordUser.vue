<script setup lang="ts">
import { validateText } from '@/tools/validations.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required, minLength, email } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import Password from 'primevue/password';
const displayModal=ref(false)
const state=reactive({
password:null
})

const rules = computed(() => {
    return {

        Password: { required: helpers.withMessage(' الحقل مطلوب', required)},

    }
})

const v$ = useVuelidate(rules, state);

</script>

<template>
<Dialog header="تغيير كلمة المرور"
style="margin-right: .5em;"
 v-model:visible="displayModal" 
 :breakpoints="{'960px': '75vw', '640px': '90vw'}" 
 :style="{width: '60vw'}" 
 :modal="true">

 <form @submit.prevent="submitForm">

 <div class="grid p-fluid ">

    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
        <Password model="state.Password" toggle-mask dir="ltr"/>  
            <label style="right:40px;" for="subscriptionType">كلمة المرور السابقة</label>
            <div style="height: 2px;"> 
            <error v-for="error in v$.Password.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>
        </span>
    </div>

    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
        <Password model="state.Password" toggle-mask dir="ltr"/>  
            <label style="right:40px;" for="subscriptionType">كلمة المرور</label>
            <div style="height: 2px;"> 
            <error v-for="error in v$.Password.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>
        </span>
    </div>

    <div class="field col-12 md:col-6 lg:col-4">
        <span class="p-float-label ">
        <Password model="state.Password" toggle-mask dir="ltr"/>  
            <label style="right:40px;" for="subscriptionType">تأكيد كلمة المرور</label>
            <div style="height: 2px;"> 
            <error v-for="error in v$.Password.$errors" :key="error.$uid" class="p-error">{{
                error.$message }}</error>
                </div>
        </span>
    </div>
    </div>

    <Button @click="submitForm" icon="fa-solid fa-check" label="تغيير" />

  <Button @click="displayModal = !displayModal" icon="fa-solid fa-ban" label="إلغاء التعديل"
    class="p-button-danger" style="margin-right: .5em;" />
 </form>
</Dialog>

<Button icon="fa-solid fa-lock"
 label="تغيير كلمة المرور" 
@click="displayModal = true"
class="mr-2"
style="width: 13rem;"
 />

</template>

<style>
</style>