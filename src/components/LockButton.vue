<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const prop=defineProps<{
    id:number
    name:string
    typeLock:string
}>()

const deleteProductDialog = ref(false)

const emit=defineEmits(['getList'])

const toast = useToast();

const icon:string="fa-solid fa-lock" 

function lockButton() {
    axios.put('https://localhost:7003/api/'+prop.typeLock+'/'+prop.id+'/lock' )
.then(response => {
 toast.add({ severity: 'success', summary: 'Confirmed', detail: response.data.msg, life: 3000 });
 emit('getList')

});
    console.log(prop.id)
    console.log(prop.typeLock)
}


</script>

<template>
                <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="prop.name">هل انت متأكد من قفل العميل <b>{{prop.name}}</b> ؟</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="lockButton" />
            </template>
        </Dialog>
    <Button @click="deleteProductDialog = true" :icon="icon" severity="info" text rounded aria-label="Cancel" />
</template>