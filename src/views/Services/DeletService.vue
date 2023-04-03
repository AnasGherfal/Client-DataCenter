<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ref } from 'vue';

const confirm = useConfirm();
const toast = useToast();

const deleteProductDialog = ref(false)

const props= defineProps<{
    pakge:string
}>()

const emit=defineEmits(['getList'])

const delet = () => {

      axios.delete('https://localhost:7003/api/Service?id='+ props.pakge.id )
      .then(response => {
       console.log(response)
       toast.add({ severity: 'success', summary: 'Confirmed', detail: response.data.msg, life: 3000 });
       deleteProductDialog.value = false
       emit('getList')
      });

    
};

    
</script>

<template>
            <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="pakge">هل انت متأكد من حدف <b>{{pakge.name}}</b> ؟</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="delet" />
            </template>
        </Dialog>

        <Button  
             @click="deleteProductDialog = true"
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