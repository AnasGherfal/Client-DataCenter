<script setup lang="ts">
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
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {

      axios.delete('https://localhost:7003/api/Service?id='+props.pakge.id )
      .then(response => {
       console.log(response)
      });
    
            toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
                },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

    
</script>

<template>
    <Toast />
    <ConfirmDialog>

    </ConfirmDialog>
        <Button  
             @click="delet"
             style="height: 25px; width: 25px;float: left;"
             icon="fa-solid fa-trash"
             class=" mt-2 ml-2  p-button-text p-button-danger" 
             v-tooltip="{value:'تعديل الباقة', fitContent:true}" />
</template>