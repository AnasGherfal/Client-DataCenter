<script setup lang="ts">
import { computed, provide, reactive, ref, type Ref } from 'vue';
import { useToast } from "primevue/usetoast";
import Dialog from 'primevue/dialog';
import type { Representatives } from '../modules/Representatives';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { toNumber } from '@vue/shared';
import RepresentativeForm from '@/components/Representatives/RepresentativeForm.vue';



const route = useRoute()
const props = defineProps<{
    representativeLength: number
}>()
const userId = computed(() => {
    if (route && route.params && route.params.id) {
        return route.params.id
    } else {
        return null // or return a default value if id is not available
    }
})

const emit = defineEmits(['getRepresentatives'])
const representatives = ref<Representatives>({
    firstName: "",
    lastName: "",
    identityNo: "",
    email: "",
    phoneNo: "",
    identityType: null, //1 personalId 2-authorized 3-representitive
    customerId: toNumber(userId.value)
})


const toast = useToast();

const onFormSubmit = async (representative: Representatives) => {
    try {

        const response = await axios.post("https://localhost:7003/api/Representives", representative)

        emit('getRepresentatives')
        toast.add({ severity: 'success', summary: 'رسالة نجاح', detail: response.data.msg, life: 3000 });


        displayModal.value = false;
        resetForm();

    } catch (error) {
        console.log(error)


    }



}

const resetForm = () => {
    representatives.value.firstName = '';
    representatives.value.lastName = '';
    representatives.value.email = '';
    representatives.value.phoneNo = '';
    representatives.value.identityNo = '';
    representatives.value.identityType = null;

}
const displayModal = ref(false);
const openModal = () => {

    displayModal.value = true;

};

</script>


<template >
    <div>

        <Button @click="openModal" class=" p-button-primary mb-4">
            اضافة مُخول
        </Button>
        <Dialog header="اضافة مُخول" contentStyle="max-height: 80vh; max-width: 90vw; min-width:75vw; padding: 20px;"
            v-model:visible="displayModal" :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :modal="true">

            <template #default>


                <RepresentativeForm @form-submit="onFormSubmit" :representatives="representatives" :submitButtonText="'add'"
                    value="اضافه">

                </RepresentativeForm>

            </template>

        </Dialog>

    </div>
</template>

<style>
.p-card-title {
    text-align: right;

}

.p-inputtext {
    text-align: right;
    border-radius: 10px;
}

.p-inputtext-filled {
    text-align: right;
    align-items: end;
    align-content: end;

}
</style>