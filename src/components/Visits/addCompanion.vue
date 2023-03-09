<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useCounterStore } from '@/stores/packages'
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';

const state = reactive({
    nameCompanion: '',
    adjactive: '',
    typeNum: '',
    num: '',
})

const rules = computed(() =>{
    return {
    nameCompanion:{  required: helpers.withMessage('ادخل اسم المرافق',required)},
    adjactive: {required: helpers.withMessage('يجب ادخال الصفة',required)},
    typeNum: {required: helpers.withMessage('اختر نوع اثبات الهوية',required)},
    num: {required: helpers.withMessage('ادخل رقم الاثبات',required)},
    }
})

const toast = useToast();

const v$ = useVuelidate(rules, state);

const submitForm = async () => {
    const result = await v$.value.$validate();

    if(result){
        toast.add({severity:'success', summary: 'Success Message', detail:'تمت إضافة الباقة', life: 3000});
    }

        }

const resetForm = () => {
    state.nameCompanion = '';
    state.adjactive= '';
    state.typeNum = '';
    state.num= '';
        }

    const store=useCounterStore()
    

const displayModal = ref(false);

const openModal = () => {
            displayModal.value = true;
        };
        const closeModal = () => {
            displayModal.value = false;
        }


</script>

<template>
    <Dialog  header="اضافة مُرافق" contentStyle="height: 200px; padding: 20px;"  v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '60vw'}" :modal="true">
    
    <form @submit.prevent="submitForm">
     <div class="grid p-fluid ">
      <div class="field col-12 md:col-4 ">
          <span class="p-float-label" >
              <InputText id="nameCompanion" type="text" v-model="state.nameCompanion"  />
              <label  for="nameCompanion">اسم المرافق </label>
              <error  v-for="error in v$.nameCompanion.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
          </span>
      </div>
  
      <div class="field col-12 md:col-4">
          <span class="p-float-label ">
              <InputText id="adjactive" type="text" v-model="state.adjactive" />
              <label for="adjactive" >صفة المرافق</label>
              <error  v-for="error in v$.adjactive.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
          </span>
      </div>

      <div class="field col-12 md:col-4">
                        <span class="p-float-label ">
                            <Dropdown id="typeNum" v-model="state.typeNum" placeholder="اختر نوع الاثبات" emptyMessage="لاتوجد انواع"/>
                            <label for="typeNum">نوع الاثبات</label>
                        </span>
                    </div>
  
  
      <div class="field col-12 md:col-4">
          <span class="p-float-label ">
              <InputText id="num" type="text" v-model="state.num" />
              <label for="num" >رقم الاثبات</label>
              <error  v-for="error in v$.num.$errors" :key="error.$uid" class="p-error" >{{ error.$message }}</error>
          </span>
      </div>
  

  

  
  </div>
  
  </form>
  <template #footer>
      <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
  <Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary" style="margin-right: .5em;background-color: red;" />
  <Toast position="bottom-right" />
                  <!-- <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                  <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus /> -->
              </template>
          </Dialog>
  
      <Button @click="openModal"  class=" p-button-primary p-button" > 
        اضافة مُرافق
      </Button>
</template>