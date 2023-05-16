<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { representativesApi } from "@/api/representatives";

const toast = useToast();

const deleteRepresentative = ref(false);
const loading = ref(false);
const props = defineProps<{
  name: any;
}>();

const emit = defineEmits(["getRepresentatives"]);

const deleteRepresentitive = () => {
  loading.value = true;

  representativesApi
    .remove(props.name.id)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "Confirmed",
        detail: response.data.msg,
        life: 3000,
      });
      emit("getRepresentatives");
    })
    .catch((error) => {
      toast.add({
        severity: "warn",
        summary: "Confirmed",
        detail: error,
        life: 3000,
      });
    })
    .finally(() => {
      deleteRepresentative.value = false;

      loading.value = false;
    });
};
</script>

<template>
  <Dialog
    v-model:visible="deleteRepresentative"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="name"
        >هل انت متأكد من حذف
        <b>{{ name.firstName }} {{ name.lastName }}</b> ؟</span
      >
    </div>
    <template #footer>
      <Button
        label="لا"
        icon="pi pi-times"
        text
        @click="deleteRepresentative = false"
      />
      <Button
        label="نعم"
        icon="pi pi-check"
        text
        @click="deleteRepresentitive"
        :loading="loading"
      />
    </template>
  </Dialog>

  <Button
    @click="deleteRepresentative = true"
    style="height: 25px; width: 25px; float: left"
    icon="fa-solid fa-trash"
    class="mt-2 ml-2 p-button-text p-button-danger"
    v-tooltip="{ value: 'حذف المخول', fitContent: true }"
  />
</template>

<style>
.p-dialog.p-confirm-dialog .p-confirm-dialog-message:not(:first-child) {
  margin-right: 1rem;
}
</style>
