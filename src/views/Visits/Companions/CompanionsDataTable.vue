<script lang="ts" setup>
import { ref } from "vue";
import addCompanion from "./addCompanion.vue";
const props = defineProps(["compList", "editable","compId"]);
const dialog = ref(false);
const selectedCompanion = ref(); // Store the selected companion for editing

const openDialog = (companion: any) => {
  selectedCompanion.value = { ...companion }; // Create a copy of the selected companion
  dialog.value = true;
};

type IdentityTypeOption = {
  value: number;
  text: string;
};
// Array of identity type options
const getIdentityTypeText = (type: number) => {
  switch (type) {
    case 1:
      return "اثبات هويه";
    case 2:
      return "جواز سفر";
    // Add more cases for other identity types

  }
};


function deleteCompanion(companion: any) {

  const index = props.compList.findIndex((c: any) => c.identityNo === companion.data.identityNo);

  console.log(index)
  if (index !== -1) {
    props.compList.splice(index, 1);
  }

}
</script>

<template>
  <DataTable v-if="compList.length > 0" :value="compList">
    <Column field="firstName" header="اسم المرافق"></Column>
    <Column field="lastName" header="لقب المرافق"></Column>

    <Column field="jobTitle" header="صفة المرافق"></Column>
    <Column field="identityType" header="نوع الاثبات">
    <template #body="{data}">
      {{ getIdentityTypeText(data.identityType) }}
      

    </template></Column>
    <Column field="identityNo" header="رقم الاثبات"></Column>
    <Column header="  الاجراءات ">
      <template #body="slotProps">
        
        <Button
          class="btn btn-danger"
          @click="deleteCompanion(slotProps)"
          v-tooltip.top="{ value: 'حذف', fitContent: true }"
          icon="fa-solid fa-trash"
          severity="danger"
          text
          rounded
          aria-label="Cancel"
          :disabled="props.editable"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>
