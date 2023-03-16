<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { email, minLength, required, helpers, integer } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';

const state = reactive({
    startWorkTime: '',
    endWorkTime: '',
    priceInWorkTime: 0,
    priceAfterWorkTime: 0,
})

const rules = computed(() =>{
    return {
        startWorkTime:{  required: helpers.withMessage('ادخل اسم المرافق',required)},
        endWorkTime: {required: helpers.withMessage('يجب ادخال الصفة',required)},
        priceInWorkTime: {required: helpers.withMessage('اختر نوع اثبات الهوية',required)},
        priceAfterWorkTime: {required: helpers.withMessage('ادخل رقم الاثبات',required)},
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
    state.startWorkTime= '',
    state.endWorkTime='',
    state.priceInWorkTime= 0,
    state.priceAfterWorkTime= 0
        }

    

const displayModal = ref(false);

const openModal = () => {
            displayModal.value = true;
        };
        const closeModal = () => {
            displayModal.value = false;
        }


</script>

<template>
    <Dialog  header="اضافة ساعه جديده" contentStyle="height: 200px; padding: 20px;"  v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '60vw'}" :modal="true">
    
    <form @submit.prevent="submitForm">
     <div class="grid p-fluid ">
      <div class="field col-12 md:col-4 ">
          <span class="p-float-label" >
          </span>
      </div>
  


  </div>
  
  </form>
  <template #footer>
      <Button @click="submitForm" class="p-button-primry" icon="fa-solid fa-plus" label="إضافة" type="submit" />
  <Button @click="resetForm" icon="pi pi-refresh" label="مسح" class="p-button-secondary" style="margin-right: .5em;" />
  <Toast position="bottom-right" />

              </template>
          </Dialog>
  
      <Button @click="openModal"  class=" p-button-primary p-button" > 
        اضافة ساعات جديده
      </Button>
</template>