<script setup lang="ts">
import { validateText } from "../../tools/validations";
import { useSubscriptionsStore } from "../../stores/subscriptions";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { computed, reactive, ref } from "vue";
import type { RequestUserModel } from "../../Modules/UserModule/UserModuleRequest";
import BackButton from "../../components/BackButton.vue";
import ChangePasswordUser from '../../components/User/ChangePasswordUser.vue';

const store = useSubscriptionsStore();
const actEdit = ref(true);
const props = defineProps<{
  user: RequestUserModel;
}>();
const loading = ref(false);

const state: RequestUserModel = reactive({
  id: props.user.id,
  fullName: props.user.fullName,
  empId: props.user.empId,
  permisssions: props.user.permisssions,
  status: props.user.status,
  password: props.user.password,
});

const rules = computed(() => {
  return {
    fullName: {
      required: helpers.withMessage("الحقل مطلوب", required),
      validateText: helpers.withMessage(
        ", حروف عربيه او انجليزيه فقط",
        validateText
      ),
      minLength: helpers.withMessage(
        "يجب أن يحتوي على الأقل 3 أحرف",
        minLength(3)
      ),
    },
    password: { required: helpers.withMessage(" الحقل مطلوب", required) },
    empId: { required: helpers.withMessage("الحقل مطلوب", required) },
  };
});

console.log(state);

const toast = useToast();

const v$ = useVuelidate(rules, state);

const resetForm = () => {
  (state.empId = null), (state.fullName = ""), (state.password = "");
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        البيانات الشخصية

        <BackButton style="float: left" />


        <Divider />
        
      </template>
      <template #content>
        <div v-if="user.status == 5" class="mb-5">
        <div class="warning-message">
          <div class="warning-message-icon"></div>
          <div class="warning-message-text">
            هذا المستخدم  مقفل لا يمكن التعديل عليه
          </div>
        </div>
      </div>

        <div v-if="store.loading">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <Skeleton
                  :loading="loading"
                  width="100%"
                  height="2rem"
                ></Skeleton>
              </span>
            </div>
          </div>
        </div>
        <form @submit.prevent="">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="fullName"
                  :disabled="true"
                  v-model="user.fullName"
                  style="direction: ltr; text-align: end"
                />
                <label for="FullName">اسم الموظف</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.fullName.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputNumber
                  id="EmpId"
                  v-model="user.empId"
                  :disabled="true"
                  style="direction: rtl; text-align: end"
                />
                <label for="EmpId">الرقم الوظيفي</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.empId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputNumber
                  id="EmpId"
                  mask="9999999"
                  v-model="user.empId"
                  :disabled="true"
                  style="direction: rtl; text-align: end"
                />
                <label for="EmpId">البريد الإلكتروني</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.empId.$errors"
                    :key="error.$uid"
                    class="p-error"
                    >{{ error.$message }}</error
                  >
                </div>
              </span>
            </div>
          </div>
          <div v-if="!actEdit">
            <Button @click="" icon="fa-solid fa-check" label="تعديل" />

            <ChangePasswordUser />

            <Button
              @click="actEdit = !actEdit"
              icon="fa-solid fa-ban"
              label="إلغاء التعديل"
              class="p-button-danger"
              style="margin-right: 0.5em"
            />
          </div>
          <Toast position="bottom-right" />
        </form>
      </template>
    </Card>
  </div>
</template>

<style></style>
