<script setup lang="ts">import { reactive } from 'vue';


const state = reactive({
    name: "" as string,
    email: "",
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',

})
</script>

<template>
<div>
    <card>
        <template #title>
            بيانات {name}
            <Divider/>

        </template>
        <template #content>
            <div class="grid p-fluid " >
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


                </div>
        </template>

        
    </card>
</div>
</template>