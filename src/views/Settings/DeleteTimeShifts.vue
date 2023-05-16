<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { timeShiftsApi } from "@/api/timeShifts";


const toast = useToast();
const loading = ref(false);
const deleteProductDialog = ref(false);

const props = defineProps<{
  name: any;
}>();

const emit = defineEmits(["getTimeShifts"]);
const deleteTimeShift = () => {
  loading.value = true;

  timeShiftsApi
    .remove(props.name.id)
    .then((response) => {
      console.log(response);

      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data.msg,
        life: 3000,
      });
    })
    .catch((error) => {
      console.log(error);
      toast.add({
        severity: "warn",
        summary: "خطا",
        detail: error,
        life: 3000,
      });
    })
    .finally(() => {
      deleteProductDialog.value = false;
      loading.value = false;
      emit("getTimeShifts");
      
    });
};
</script>

<template>
  <Dialog
    v-model:visible="deleteProductDialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="confirmation-content">
      <i
        class="pi pi-exclamation-triangle mr-3"
        style="font-size: 2rem; color: red"
      />
      <span v-if="name"
        >هل انت متأكد من حذف <b>{{ name.name }}</b> ؟</span
      >
    </div>
    <template #footer>
      <Button
        label="نعم"
        icon="pi pi-check"
        text
        @click="deleteTimeShift"
        :loading="loading"
      />

      <Button
        label="لا"
        icon="pi pi-times"
        text
        @click="deleteProductDialog = false"
      />
    </template>
  </Dialog>

  <Button
    @click="deleteProductDialog = true"
    style=""
    icon="fa-solid fa-trash"
    class="p-button-text p-button-danger"
    v-tooltip="{ value: 'حذف الساعه', fitContent: true }"
  />
</template>

<style>
.p-dialog.p-confirm-dialog .p-confirm-dialog-message:not(:first-child) {
  margin-right: 1rem;
}
</style>
