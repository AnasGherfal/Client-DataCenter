<script setup lang="ts">
import axios from "axios";
import Dialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import type { Service } from '../../../Modules/ServicesModule/ServicesModule';
import { serviceApi } from "../../../api/service";

const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);

const deleteProductDialog = ref(false);

const props = defineProps<{
  pakge: Service;
}>();

const emit = defineEmits(["getList"]);

const delet = () => {
  loading.value = true;
  serviceApi
    .remove(props.pakge.id)
    .then((response) => {
      loading.value = false;
      toast.add({
        severity: "success",
        summary: "Confirmed",
        detail: response.data.msg,
        life: 3000,
      });
      deleteProductDialog.value = false;
      emit("getList");
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "رسالة فشل",
        detail: error,
        life: 3000,
      });
    });
};
</script>

<template>
  <Dialog
    v-model:visible="deleteProductDialog"
    :style="{ width: '450px' }"
    header="تأكيد"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color:red" />
      <span v-if="pakge"
        >هل انت متأكد من حذف <b>{{ pakge.name }}</b> ؟</span
      >
    </div>
    <template #footer>
      
      <Button
        label="نعم"
        style="color:green"
        icon="pi pi-check"
        :loading="loading"
        text
        @click="delet"
      />
      <Button
        label="لا"
        style="color:red"
        icon="pi pi-times"
        text
        @click="deleteProductDialog = false"
      />
    </template>
  </Dialog>

  <Button
    @click="deleteProductDialog = true"
    style="float: left"
    icon="fa-solid fa-trash"
    class="mt-2 ml-2 p-button-text p-button-danger"
    v-tooltip="{ value: 'حدف الباقة', fitContent: true }"
  />
</template>

<style>
.p-dialog.p-confirm-dialog .p-confirm-dialog-message:not(:first-child) {
  margin-right: 1rem;
}
</style>
