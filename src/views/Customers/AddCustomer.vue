<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from '@/stores/customers'
import axios from 'axios';
import router from '@/router';
import BackButton from '@/components/BackButton.vue';
import type { Customer } from './modules/Customers';
import CustomerForm from '@/components/Customers/CustomerForm.vue';

const store = useCustomersStore();
const loading = ref(false);

const editable =ref(false);

const customer= ref<Customer>({
    name: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    address: '',
    file: null
});

const onFormSubmit = async (customer: Customer) => {
    try {
            setTimeout(() => {
                router.go(-1)
                loading.value = false;

            }, 1000);
            loading.value = true;
            const response = await axios.post("https://localhost:7003/api/Customers", customer);
            console.log(response)
            toast.add({ severity: 'success', summary: 'رسالة نجاح', detail: response.data.msg, life: 3000 });
            store.getdata();
        
    } catch (error) {
        console.log(error);
    }
}

const toast = useToast();

const resetForm = () => {
    customer.value.name = '';
    customer.value.email = '';
    customer.value.primaryPhone = '';
    customer.value.secondaryPhone = '';
    customer.value.address = '';
    customer.value.file = null;
}


</script>


<template >
    <div>
        <Card>

            <template #title>

                إضافة عميل

                <BackButton style="float: left;" />

                <Divider />

            </template>
            <template #content>

                <CustomerForm @form-submit="onFormSubmit" 
                :customers="customer" :submitButtonText="'add'" >
                <Toast position="bottom-left" />

                </CustomerForm>

            </template>


        </Card>

    </div>
</template>
<style scoped>


/* .menuitem-content:hover {

} */
</style>