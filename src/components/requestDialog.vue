<script setup lang="ts">
import { ref } from 'vue';


const dialog = ref(false);
const loading = ref(false);

</script>

<template>

<Button
          icon="fa-solid fa-hand-point-up"
          severity="info"
          text
          rounded
          v-tooltip="{ value: 'طلب', fitContent: true }"
          @click="dialog=true"
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
      <span 
        >رفض او قبول ؟</span
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