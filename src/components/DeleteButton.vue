<script setup lang="ts">
import { admin } from "@/api/admin";
import { useCustomersStore } from "@/stores/customers";
import { useSubscriptionsStore } from "@/stores/subscriptions";

import { useToast } from "primevue/usetoast";
import { ref } from "vue";

const loading = ref(false);
const dialog = ref(false);

const props = defineProps<{
  name: string;
  id: string;
  type: string;
}>();

defineEmits(["submit"]);

</script>

<template>
  <Button
    @click="dialog = true"
    v-tooltip.top="{ value: 'حذف', fitContent: true }"
    icon="fa-solid fa-trash"
    severity="danger"
    text
    rounded
    aria-label="Cancel"
  ></Button>
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
        @click="$emit('submit'); dialog = false"
        :loading="loading"
      />
      <Button label="لا" icon="pi pi-times" text @click="dialog = false" />
    </template>
  </Dialog>
</template>
