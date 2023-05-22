<script setup lang="ts">
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { computed, ref, reactive } from "vue";
import { useCustomersStore } from "@/stores/customers";
const prop = defineProps<{
  id: number;
  name: string;
  status: number;
  typeLock: string;
}>();

const store = useCustomersStore();

const loading = ref(false);

const dialog = ref(false);

const emit = defineEmits(["getdata"]);

const toast = useToast();

const status = reactive({ value: prop.status });

const lockedIcon = computed(() =>
  status.value === 5 ? "fa-solid fa-lock" : "fa-solid fa-lock-open"
);

const buttonColor = computed(() => (status.value === 5 ? "green" : "red"));
const tooltipValue = computed(() =>
  status.value === 5 ? "الغاء تقييد" : "تقييد "
);
function lockButton() {
  loading.value = true;

  axios
    .put(`https://localhost:7003/api/${prop.typeLock}/${prop.id}/lock`)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data,
        life: 3000,
      });
      status.value = 5;
      emit("getdata");
      dialog.value = false;
      loading.value = false;
    });
}

function unlockButton() {
  loading.value = true;

  axios
    .put(`https://localhost:7003/api/${prop.typeLock}/${prop.id}/unlock`)
    .then((response) => {
      toast.add({
        severity: "success",
        summary: "رسالة تأكيد",
        detail: response.data,
        life: 3000,
      });
      status.value = 1;
      emit("getdata");
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: "رسالة خطأ",
        detail: e.data,
        life: 3000,
      });
    })
    .finally(() => {
      dialog.value = false;
      loading.value = false;
    });
}
</script>

<template>
  <Dialog
    v-model:visible="dialog"
    :style="{ width: '450px' }"
    header="Confirm"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="prop.id"
        >هل انت متأكد من <b> {{ `${tooltipValue} ${prop.name}` }}</b> ؟</span
      >
    </div>
    <template #footer>
      <Button
        label="نعم"
        icon="pi pi-check"
        text
        :loading="loading"
        @click="status.value === 5 ? unlockButton() : lockButton()"
      />
      <Button label="لا" icon="pi pi-times" text @click="dialog = false" />
    </template>
  </Dialog>
  <Button
    v-tooltip="{ value: tooltipValue, fitContent: true }"
    @click="dialog = true"
    :icon="lockedIcon"
    :class="buttonColor"
    text
    rounded
    aria-label="Cancel"
  />
</template>
<style>
.fa-solid.fa-lock {
  color: red;
}

.fa-solid.fa-lock-open {
  color: green;
}

.p-button.primary .fa-solid.fa-lock {
  color: red;
}

.p-button.info .fa-solid.fa-lock-open {
  color: rgb(80, 183, 80);
}
</style>
