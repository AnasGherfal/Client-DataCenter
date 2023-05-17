<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from "@/stores/customers";
import router from "@/router";
import BackButton from "@/components/BackButton.vue";
import type { Customer } from "../../Models/CustomerModel/Customers";
import CustomerForm from '../Customers/CustomerForm.vue'
import { customersApi } from "@/api/customers";

const store = useCustomersStore();

const editable = ref(false);
const loading = ref(false);

const customer:Customer = ref({
  name: "",
  email: "",
  primaryPhone: "",
  secondaryPhone: "",
  address: "",
  file:null
});

const onFormSubmit = async (customer: Customer) =>{
  store.loading = true;

  customersApi
    .create(customer)
    .then((response) => {
      store.getCustomers();
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 3000,
      });
      setTimeout(() => {
        router.go(-1);
      }, 500);
    })
    .catch(() => {
      store.loading = false;
      toast.add({ severity: "error", summary: "خطأ", detail: "", life: 3000 });
    })
    .finally(() => {
      loading.value = false;
    });
};

// async (customer: Customer) => {
//     try {

//         store.loading=true
//             const response = await axios.post("https://localhost:7003/api/Customers", customer);
//             store.getCustomers();

//             toast.add({ severity: 'success', summary: 'رسالة نجاح', detail: response.data.msg, life: 3000 });
//             setTimeout(() => {
//                 router.go(-1)

//             }, 500);

//     } catch (error:any) {
//         console.log(error);
//         store.loading=false
//         toast.add({ severity: 'error', summary: 'خطأ', detail: error.response.data, life: 3000 });

//     }
// }

const toast = useToast();

const resetForm = () => {
  customer.name = "";
  customer.email = "";
  customer.primaryPhone = "";
  customer.secondaryPhone = "";
  customer.address = "";
  customer.file = null;
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        إضافة عميل

        <BackButton style="float: left" />

        <Divider />
      </template>
      <template #content>
        <CustomerForm
          @form-submit="onFormSubmit"
          :customers="customer"
          :submitButtonText="'add'"
          :loading="store.loading"
        >
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
