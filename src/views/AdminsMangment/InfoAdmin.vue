<script setup lang="ts">
import { validateText } from "../../tools/validations";
import { useSubscriptionsStore } from "../../stores/subscriptions";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { computed, reactive, ref, onMounted } from "vue";
import type { ResponseAdminModel } from "../../Modules/AdminModule/AdminModuleResponse";
import BackButton from "../../components/BackButton.vue";
import ChangePasswordUser from "../../components/User/ChangePasswordUser.vue";

// const store = useSubscriptionsStore();
const props = defineProps<{
  admin: any;
}>();
const loading = ref(false);
const state: ResponseAdminModel = reactive({
  id: props.admin.id,
  displayName: props.admin.displayName,
  email: props.admin.email,
  permissions: props.admin.permissions,
  isActive: props.admin.isActive,
  createdOn: props.admin.createdOn,
});

const rules = computed(() => {
  return {
    displayName: {
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
  };
});

const toast = useToast();

const v$ = useVuelidate(rules, state);

// const resetForm = () => {
//   (state.empId = null), (state.fullName = ""), (state.password = "");
// };
</script>

<template>
  <div>
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <span> البيانات الشخصية </span>
          <BackButton style="" />
        </div>

        <Divider />
      </template>
      <template #content>
        <div v-if="admin.isActive == false" class="mb-5">
          <div class="warning-message">
            <div class="warning-message-icon"></div>
            <div class="warning-message-text">
              هذا المستخدم مقفل لا يمكن التعديل عليه
            </div>
          </div>
        </div>

        <div v-if="loading">
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
        <div>
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="displayName">اسم المستخدم</label>
                <InputText
                  id="displayName"
                  nameid="displayName"
                  :disabled="true"
                  v-model="admin.displayName"
                />
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="">
                <label for="email">البريد الإلكتروني</label>
                <InputText
                  id="email"
                  name="email"
                  v-model="admin.email"
                  :disabled="true"
                />
              </span>
            </div>
          </div>

          <Toast position="bottom-right" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style></style>
