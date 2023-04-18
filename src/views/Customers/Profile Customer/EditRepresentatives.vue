
<script setup lang="ts">
import RepresentativeForm from '@/components/Representatives/RepresentativeForm.vue';
import { toNumber } from '@vue/shared';
import { computed, inject, provide, reactive, ref } from 'vue';
import type { Representatives } from '../modules/Representatives';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';


const props = defineProps<{
    name: any
}>()
const emit = defineEmits(['getRepresentatives'])

const route = useRoute()
const userId = computed(() => {
    if (route && route.params && route.params.id) {
        return route.params.id
    } else {
        return null // or return a default value if id is not available
    }
})

const representatives: Representatives = reactive({
    firstName: props.name.firstName,
    lastName: props.name.lastName,
    identityNo: props.name.identityNo,
    email: props.name.email,
    phoneNo: props.name.phoneNo,
    identityType: props.name.identityNo, //1 personalId 2-authorized 3-representitive
    customerId: toNumber(userId.value),
})
const toast = useToast();

const onFormSubmit = async (representative: Representatives) => {
    console.log(props.name.id)
    console.log(representative)


    axios.put(`https://localhost:7003/api/Representives/${props.name.id}`, representative)

        .then(response => {
            emit('getRepresentatives')
            toast.add({ severity: 'success', summary: 'Success Message', detail: response.data.msg, life: 3000 });
            displayModal.value = false;

        })
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
    <div>
        <Button @click="openModal" style="height: 25px; width: 25px;" icon=" fa-solid fa-pen"
            class=" mt-2 mr-2 p-button-primary p-button-text" v-tooltip="{ value: 'تعديل الباقة', fitContent: true }" />

        <Dialog header="تعديل المخول" contentStyle="max-height: 80vh; width: 75vw; padding: 20px;"
            v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :modal="true">

            <template #default>

                <RepresentativeForm @form-submit="onFormSubmit" :representatives="representatives"
                    :submit-button-text="'Edit'" value="تعديل">

                </RepresentativeForm>
            </template>
        </Dialog>

    </div>
</template>