<script setup lang="ts">
import { reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useCustomersStore } from "@/stores/customers";
import router from "@/router";
import BackButton from "@/components/BackButton.vue";
import type { Customer } from "../../Modules/CustomerModule/CustomersModule";
import CustomerForm from "../Customers/CustomerForm.vue";
import { customersApi } from "@/api/customers";

const store = useCustomersStore();

const loading = ref(false);

const customer: Customer = reactive({
  name: "",
  email: "",
  primaryPhone: "",
  secondaryPhone: "",
  address: "",
  files: [{file:"", docType:0}],
});

const docType = ref(1)

const onFormSubmit = async (customer: Customer) => {
  const formData = new FormData();

  formData.append("name", customer.name);
  formData.append("email", customer.email);
  formData.append("primaryPhone", customer.primaryPhone);
  formData.append("secondaryPhone", customer.secondaryPhone);
  formData.append("address", customer.address);
  formData.append("files", customer.files[0].file);
  formData.append("docTypes", customer.files[0].docType.toString());


  const formDataObject: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value.toString();
  });

  console.log("formData:", formDataObject);

  store.loading = true;
//   customerForm.forEach((value, key) => {
//   console.log(key, value);
// });
  customersApi
    .create(formData)
    .then((response) => {
      store.getCustomers();
      toast.add({
        severity: "success",
        summary: "رسالة نجاح",
        detail: response.data.msg,
        life: 3000,
      });
      // router.go(-1);
      setTimeout(() => {
        resetForm();
      }, 500);
    })
    .catch(() => {
      toast.add({ severity: "error", summary: "خطأ", detail: "", life: 3000 });
    })
    .finally(() => {
      loading.value = false;
    });
};
const toast = useToast();

const resetForm = () => {
  customer.name = "";
  customer.email = "";
  customer.primaryPhone = "";
  customer.secondaryPhone = "";
  customer.address = "";
  customer.files = [{file:'', docType:0}];
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

</style>
