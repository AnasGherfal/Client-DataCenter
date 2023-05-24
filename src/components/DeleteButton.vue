<script setup lang="ts">
import { customersApi } from "@/api/customers";
import { useCustomersStore } from "@/stores/customers";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

const loading = ref(false);
const store = useCustomersStore();
const toast = useToast();
const dialog = ref(false);

const props = defineProps<{
  name:string,
  id:number,
  type:string,
}>();

console.log(props.name)
const deleteCustomer = () => {
  loading.value = true;
  axios
    .delete(`https://localhost:7003/api/${props.type}/${props.id}`)
    .then((response) => {
      store.getCustomers();
      toast.add({
        severity: "success",
        summary: "تم الحذف",
        detail: response.data,
        life: 3000,
      });
      dialog.value = false;
    })
    .catch((error) => {
      toast.add({
        severity: "warn",
        summary: "حدث خطأ",
        detail: error,
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <Button
    @click="dialog=true"
    v-tooltip.top="{ value: 'حذف', fitContent: true }"
    icon="fa-solid fa-trash"
    severity="danger"
    text
    rounded
    aria-label="Cancel"
    
  />

  <Dialog 
    v-model:visible="dialog"
    :style="{ width: '450px' }"
    header="تأكيد"
    :modal="true"
  >
    <div class="confirmation-content">
      <i
        class="pi pi-exclamation-triangle mr-3"
        style="font-size: 2rem; color: red"
      />
      <span v-if="props.name"
        >هل انت متأكد من حذف <b>{{ props.name }}</b> ؟</span
      >
    </div>
    <template #footer>
      <Button
        label="نعم"
        icon="pi pi-check"
        text
        @click="deleteCustomer"
        :loading="loading"
      />
      <Button label="لا" icon="pi pi-times" text @click="dialog = false" />
    </template>
  </Dialog>
</template>
