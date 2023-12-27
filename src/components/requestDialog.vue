<script setup lang="ts">
import { representativesApi } from '@/api/representatives';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';


const dialog = ref(false);
const loading = ref(false);
const prop = defineProps<{
  id: string;
  status: number

}>();
const status = reactive({ value: prop.status });

const emit = defineEmits(["getdata"]);

const toast = useToast();

function onApprove (){
  representativesApi
  .approve(prop.id)
  .then((response) =>{
    toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
      status.value=1;
      emit("getdata");

    
  }).catch((e)=>{
    toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.data.msg,
        life: 3000,
      });
  })
}

function onReject (){
  representativesApi
  .reject(prop.id)
  .then((response) =>{
    toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
      status.value=1;
      emit("getdata");

    
  }).catch((e)=>{
    toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.data.msg,
        life: 3000,
      });
  })
}

</script>

<template>

<Button
          icon="fa-solid fa-bell"
          severity="info"
          text
          rounded
          v-tooltip="{ value: 'طلب', fitContent: true }"
          @click="dialog=true"
        />

<Dialog
    v-model:visible="dialog"
    :style="{ width: '450px' }"
    header="تأكيد"
    :modal="true"
  >
    <div class="confirmation-content">
      <i
        class="pi pi-exclamation-triangle mr-3"
        style="font-size: 2rem; color: red"
      />
      <span 
        >هل تريد قبول هذا المخول ؟</span
      >
    </div>
    <template #footer>
      <Button
        label="قبول"
        icon="pi pi-check"
        text
        @click="onApprove"
  
      />
      <Button
        label="رفض"
        icon="pi pi-times"
        text
        @click="onReject"
  
      />
    </template>
  </Dialog>
</template>