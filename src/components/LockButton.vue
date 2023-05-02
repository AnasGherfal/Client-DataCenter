<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const prop=defineProps<{
    id:number
    typeLock:string
}>()
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
    <Button @click="lockButton" :icon="icon" severity="info" text rounded aria-label="Cancel" />
</template>