<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import ChangePasswordUser from '@/components/User/ChangePasswordUser.vue';
import { reactive } from 'vue';


const state = reactive({
    name: "" as string,
    email: "",
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',
    EmpId:17005

})
</script>

<template>
<div>
    <card>
        <template #title>
       بيانات الموظف
       <BackButton style="float: left;"/>
            <Divider/>

        </template>
        <template #content>
            <div class="grid p-fluid " >

                <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputMask id="address" mask="99999" value="الرقم الوظيفي" type="text" v-model="state.EmpId" :disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="address" >الرقم الوظيفي</label>

                        </span>
                    </div>

                    <div class="field col-12 md:col-6 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text"  value="اشرف" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="name">اسم </label>
                        </span>

                    </div>
                   <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="email" type="text" value="ashraf.howel@gmail.com" v-model="state.email" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="email">البريد الإلكتروني</label>

                        </span>
                    </div>
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label ">
                            <InputText id="address" value="هون" type="text" v-model="state.address" disabled="true" />
                            <label style="color: black;top: -.75rem; font-size: 12px;" for="address" >العنوان</label>
                        </span>
                    </div>
                <ChangePasswordUser/>
                </div>
        </template>

        
    </card>
</div>
</template>