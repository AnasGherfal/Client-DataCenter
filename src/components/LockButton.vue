<script setup lang="ts">
import router from '@/router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { computed, ref, reactive } from 'vue';
import { useCustomersStore } from '@/stores/customers'
const prop = defineProps<{
    id: number;
    name: string;
    status: number;
    typeLock: string;
}>();

const store = useCustomersStore();

const dialog = ref(false);

const emit = defineEmits(['getdata']);

const toast = useToast();

const status = reactive({ value: prop.status });

const lockedIcon = computed(() =>
    status.value === 5 ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'
);

const buttonColor = computed(() =>
    status.value === 5 ? 'green' : 'info'
);

function lockButton() {
    axios
        .put(`https://localhost:7003/api/${prop.typeLock}/${prop.id}/lock`)
        .then(response => {
            toast.add({
                severity: 'success',
                summary: 'رسالة تأكيد',
                detail: response.data,
                life: 3000
            });
            status.value = 5;
            emit('getdata');
            dialog.value = false;
        });
}

function unlockButton() {
    axios
        .put(`https://localhost:7003/api/${prop.typeLock}/${prop.id}/unlock`)
        .then(response => {
            console.log(response);
            toast.add({
                severity: 'success',
                summary: 'رسالة تأكيد',
                detail: response.data,
                life: 3000
            });
            status.value = 1;
            emit('getdata');
            dialog.value = false;

        });
}
</script>

<template>
    <Dialog v-model:visible="dialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="prop.id">هل انت متأكد من قفل العميل <b>{{ prop.name }}</b> ؟</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="dialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="status.value === 5 ? unlockButton() : lockButton()" />
        </template>
    </Dialog>
    <Button @click="dialog = true" :icon="lockedIcon" :class="buttonColor" text rounded aria-label="Cancel" />

</template>
<style>
.fa-solid.fa-lock {
  color: gray;
}

.fa-solid.fa-lock-open {
  color: green;
}

.p-button.primary .fa-solid.fa-lock {
  color: red;
}

.p-button.info .fa-solid.fa-lock-open {
  color: rgb(80, 183, 80);
}</style>