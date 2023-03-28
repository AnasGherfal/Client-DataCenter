<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const props= defineProps<{
    pakge:string
}>()



const delet = () => {
    confirm.require({
        message: 'هل انت متأكد من حدف هده الباقة؟',
        header: 'حدف',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {

      axios.delete('https://localhost:7003/api/Service?id='+ props.pakge.id )
      .then(response => {
       console.log(response)
       router.replace
       
      });
    
            toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                },
        reject: () => {
        }
    });
};

    
</script>

<template>
    <ConfirmDialog :key="pakge.id" />
        <Button  
             @click="delet"
             style="height: 25px; width: 25px;float: left;"
             icon="fa-solid fa-trash"
             class=" mt-2 ml-2  p-button-text p-button-danger" 
             v-tooltip="{value:'حدف الباقة', fitContent:true}" />
</template>

<style>
.p-dialog.p-confirm-dialog .p-confirm-dialog-message:not(:first-child) {
  margin-right: 1rem;
}
</style>