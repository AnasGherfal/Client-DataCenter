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
    subscriptionType: '',
    numberOfHours:'',

})

const filterdUsers = ref();

const searchUsers = () =>{

}

const rules = computed(() =>{
    return {
    name:{  required: helpers.withMessage('الاسم مطلوب',required)},
    phoneNumber1: {required: helpers.withMessage('رقم الهاتف مطلوب',required)},
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
                        <span class="p-float-label" >
                    <AutoComplete id='userName' v-model="state.name" :suggestions="filterdUsers" @complete="searchUsers()" :dropdown="true" optionLabel="name" forceSelection/>
                                <label for="userName">اسم العميل</label>
        </span>

</div>


                    <div class="field col-12 md:col-4 ">
                        <span class="p-float-label" >
                            <InputText id="name" type="text" v-model="state.name"  />
                            <label  for="name">اسم الخول </label>
                            <error  v-for="error in v$.name.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
                        </span>

                    </div>


                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id ="phoneNum1" v-model="state.phoneNumber1" mask="999-999-9999" />
                            <label for="phoneNum1">رقم هاتف </label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>

                    <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <InputMask id ="phoneNum1" v-model="state.phoneNumber1" mask="999-999-9999" />
                            <label for="phoneNum1">سبب الزيارة </label>
                            <error  v-for="error in v$.phoneNumber1.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>

                        </span>
                    </div>





                </div>


                <Button @click="submitForm" icon="pi pi-check" label="إضافة" type="submit" style="background-color: navy;"/>
                <Button @click="resetForm" icon="fa-solid fa-delete-left" label="مسح" class="p-button-secondary" style="margin-right: .5rem;  background-color: red;" />
                <Toast position="bottom-right" />

            </form>
            </template>
  
            

        </Card>
    </div>
</template>
<style>



error{
    font-size: 12px; 
    font-weight: bold;
}

.p-dropdown	{
    border-radius: 10px;
}
.p-float-label > label{
right: 0.5rem;
color: black;
transition-duration: 0.3s
}
/* .menuitem-content:hover {

} */
</style>