<script lang="ts" setup>
import { ref } from "vue";
import addCompanion from "./addCompanion.vue";
const props = defineProps(["compList", "editable"]);
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
const identityTypeOptions: IdentityTypeOption[] = [
  { value: 1, text: "اثبات هويه" },
  { value: 2, text: "جواز سفر" },
];

const submitForm = () => {
  const index = props.compList.findIndex(
    (companion: any) => companion.id === selectedCompanion.value.id
  );
  if (index !== -1) {
    props.compList[index] = selectedCompanion.value; // Update the companion in the compList
  }
  dialog.value = false;
};
</script>

<template>
  <DataTable v-if="compList.length > 0" :value="compList">
    <Column field="fullName" header="اسم المرافق"></Column>
    <Column field="jobTitle" header="صفة المرافق"></Column>
    <Column field="identityType" header="نوع الاثبات"> </Column>
    <Column field="identityNo" header="رقم الاثبات"></Column>
    <Column>
      <template #body="slotProps">
        <Button
          @click="openDialog(slotProps.data)"
          icon="fa-solid fa-circle-info"
          severity="info"
          text
          rounded
          v-tooltip="{ value: 'التفاصيل', fitContent: true }"
          style="width: 2rem; height: 1rem; margin-left: 0.5rem"
        />
        <div v-if="dialog">
          <Dialog
            header="تعديل مُرافق"
            contentStyle="height: 200px; padding: 20px;"
            v-model:visible="dialog"
            :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
            :style="{ width: '60vw' }"
            :modal="true"
          >
            <form @submit.prevent="submitForm">
              <div class="grid p-fluid">
                <div class="field col-12 md:col-4">
                  <span class="p-float-label">
                    <InputText
                      id="firstName"
                      type="text"
                      v-model="slotProps.data.fullName"
                    />
                    <label for="firstName">الاسم </label>
                    <!-- <div style="height: 2px">
                      <span
                        style="color: red; font-weight: bold; font-size: small"
                        v-for="error in v$.fullName.$errors"
                        :key="error.$uid"
                        class="p-error"
                      >
                        {{ error.$message }}
                      </span>
                    </div> -->
                  </span>
                </div>

                <div class="field col-12 md:col-4">
                  <span class="p-float-label">
                    <InputText
                      id="jobTitle"
                      type="text"
                      v-model="slotProps.data.jobTitle"
                    />
                    <label for="jobTitle">صفة المرافق</label>
                    <!-- <div style="height: 2px">
                      <span
                        style="color: red; font-weight: bold; font-size: small"
                        v-for="error in v$.jobTitle.$errors"
                        :key="error.$uid"
                        class="p-error"
                      >
                        {{ error.$message }}
                      </span>
                    </div> -->
                  </span>
                </div>

                <div class="field col-12 md:col-4">
                  <span class="p-float-label">
                    <Dropdown
                      id="identityType"
                      v-model="slotProps.data.identityType"
                      placeholder="اختر نوع الاثبات"
                      emptyMessage="لاتوجد انواع"
                      :options="identityTypeOptions"
                      optionValue="value"
                      optionLabel="text"
                    />
                    <!-- <div style="height: 2px">
                      <span
                        style="color: red; font-weight: bold; font-size: small"
                        v-for="error in v$.identityType.$errors"
                        :key="error.$uid"
                        class="p-error"
                      >
                        {{ error.$message }}
                      </span>
                    </div> -->
                    <label for="identityType">نوع الاثبات</label>
                  </span>
                </div>

                <div class="field col-12 md:col-4">
                  <span class="p-float-label">
                    <InputText
                      id="identityNo"
                      type="text"
                      v-model="slotProps.data.identityNo"
                    />
                    <label for="identityNo">رقم الاثبات</label>
                    <!-- <div style="height: 2px">
                      <span
                        style="color: red; font-weight: bold; font-size: small"
                        v-for="error in v$.identityNo.$errors"
                        :key="error.$uid"
                        class="p-error"
                      >
                        {{ error.$message }}
                      </span>
                    </div> -->
                  </span>
                </div>
              </div>
            </form>
            <template #footer>
              <Button
                @click="submitForm"
                class="p-button-primry"
                icon="fa-solid fa-plus"
                label="تعديل"
                type="submit"
                :disabled="props.editable"
              />

              <Toast position="bottom-left" />

              <!-- <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
                  <Button label="Yes" icon="pi pi-check" @click="closeModal" autofocus /> -->
            </template>
          </Dialog>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
