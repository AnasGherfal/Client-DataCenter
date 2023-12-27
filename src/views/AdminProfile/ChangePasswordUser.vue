<script setup lang="ts">
import { validateText } from "@/tools/validations.js";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength, email } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import Password from "primevue/password";
import { authApi } from "@/api/auth";
import { useToast } from "primevue/usetoast";
const displayModal = ref(false);
const state = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = computed(() => {
  return {
    oldPassword: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    newPassword: { required: helpers.withMessage("الحقل مطلوب", required) },
    confirmPassword: {
      required: helpers.withMessage("الحقل مطلوب", required),
      sameAsPassword: helpers.withMessage(
        "يجب أن تتطابق مع كلمة المرور",
        (value) => value === state.newPassword
      ),
    },
  };
});

const v$ = useVuelidate(rules, state);

const toast = useToast();

const submitForm = async () => {
  authApi.resetPassword(state).then((response) => {

    toast.add({
      severity: "success",
      summary: "تم التعديل",
      detail: response.data.msg,
      life: 3000,
    });
    resetForm();
    displayModal.value = false;
  });
};

const resetForm = () => {
  state.oldPassword = "";
  state.newPassword = "";
  state.confirmPassword = ""; 
}
</script>

<template>
  <Button
    icon="fa-solid fa-key"
    label="تغيير كلمة المرور"
    @click="displayModal = true"
    class="mr-2"
    style="background-color: red; color: white; border-color: white"
  />
  <Dialog
    header="تغيير كلمة المرور"
    style="margin-right: 0.5em"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '60vw' }"
    :modal="true"
  >
    <form @submit.prevent="submitForm">
      <div class="grid p-fluid">
        <div class="field col-12 md:col-6 lg:col-4">
          <span class="p-float-label">
            <Password
              v-model="state.oldPassword"
              toggle-mask
              dir="ltr"
              :feedback="false"
            />
            <label style="right: 40px" for="subscriptionType"
              >كلمة المرور السابقة</label
            >
            <div style="height: 2px">
              <error
                v-for="error in v$.oldPassword.$errors"
                :key="error.$uid"
                class="p-error"
                >{{ error.$message }}</error
              >
            </div>
          </span>
        </div>

        <div class="field col-12 md:col-6 lg:col-4">
          <span class="p-float-label">
            <Password v-model="state.newPassword" toggle-mask dir="ltr" />
            <label style="right: 40px" for="subscriptionType"
              >كلمة المرور</label
            >
            <div style="height: 2px">
              <error
                v-for="error in v$.newPassword.$errors"
                :key="error.$uid"
                class="p-error"
                >{{ error.$message }}</error
              >
            </div>
          </span>
        </div>

        <div class="field col-12 md:col-6 lg:col-4">
          <span class="p-float-label">
            <Password v-model="state.confirmPassword" toggle-mask dir="ltr" />
            <label style="right: 40px" for="subscriptionType"
              >تأكيد كلمة المرور</label
            >
            <div style="height: 2px">
              <error
                v-for="error in v$.confirmPassword.$errors"
                :key="error.$uid"
                class="p-error"
                >{{ error.$message }}</error
              >
            </div>
          </span>
        </div>
      </div>

      <Button @click="submitForm" icon="fa-solid fa-check" label="تغيير" />

      <Button
        @click="displayModal = !displayModal"
        icon="fa-solid fa-ban"
        label="إلغاء التعديل"
        class="p-button-danger"
        style="margin-right: 0.5em"
      />
    </form>
  </Dialog>
  <Toast position="bottom-left" />
</template>

<style scoped>

.p-icon{
  margin-left:10px
}
</style>
