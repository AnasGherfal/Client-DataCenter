<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { required, helpers, email, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import BackButton from "@/components/BackButton.vue";
import router from "@/router";
import { user } from "@/api/user";
import type { ResponseUserModel } from "../../Modules/UserModule/UserModuleResponse";
import { useUserStore } from "@/stores/user";

const loading = ref(false);
const store = useUserStore();

const state: ResponseUserModel = reactive({
  fullName: "",
  email: "",
  empId: null,
  permissions: "",
});


const selectedPermissions = ref([]);
const permissions = ref([
  { name: "من غير صلاحيه", value: 0 },
  { name: "جميع الصلاحيات", value: 1 },
  { name: "ادارة العملاء", value: 2 },
  { name: "مسح عميل", value: 4 },
  { name: "ادارة الخدمات", value: 8 },
  { name: "مسح خدمه", value: 16 },
  { name: "ادارة الاشتركات", value: 32 },
  { name: "مسخ اشتراك", value: 64 },
  { name: "ادارة المرافقين", value: 128 },
  { name: "مسح مرافق", value: 256 },
]);

const rules = computed(() => {
  return {
    fullName: {
      required: helpers.withMessage("الحقل مطلوب", required),
    },
    empId: {
      required: helpers.withMessage("الحقل مطلوب", required),
      minLength: helpers.withMessage("يجب أن يحتوي 4 ارقام", minLength(4)),
    },
    email: {
      required: helpers.withMessage("الحقل مطلوب", required),
      email: helpers.withMessage(" ليس عنوان بريد إلكتروني صالح", email),
    },
  };
});

console.log(state);

const toast = useToast();

const v$ = useVuelidate(rules, state);

const calculatePermissions = () => {
  let permissions = 0;
  if (selectedPermissions.value && selectedPermissions.value.length > 0) {
    permissions = selectedPermissions.value.reduce(
      (sum, perm) => sum + parseInt(perm),
      0
    );
  }
  return permissions;
};
const submitForm = async () => {
  const result = await v$.value.$validate();

  if (result) {
    const permissions = calculatePermissions();
    state.permissions = permissions;
    console.log(state.permissions);
    console.log(state);

    user
      .create(state)
      .then(function (response) {
        store.getUser();
        console.log(response);

        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: response.data.msg,
          life: 3000,
        });
        console.log(response);
        loading.value = false;
        router.go(-1);
      })
      .catch(function (error) {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "رسالة فشل",
          detail: "هنالك مشكلة في الوصول",
          life: 3000,
        });
      });
  } else {
    toast.add({
      severity: "error",
      summary: "رسالة فشل",
      detail: "قم بتعبئة الحقول",
      life: 3000,
    });
  }
  loading.value = false;
};

const resetForm = () => {
  (state.empId = null),
    (state.fullName = ""),
    (state.email = ""),
    (state.permissions = 0);
};
</script>

<template>
  <div>
    <Card>
      <template #title>
        إضافة مستخدم
        <BackButton style="float: left" />

        <Divider layout="horizontal" />
      </template>

      <template #content>
        <form @submit.prevent="submitForm">
          <div class="grid p-fluid">
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputText
                  id="FullName"
                  v-model="state.fullName"
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
                <InputText id="Email" type="text" v-model="state.email" />
                <label for="Email">البريد الإلكتروني</label>
                <div style="height: 2px">
                  <error
                    v-for="error in v$.email.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</error
                  >
                </div>
              </span>
            </div>

            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <InputNumber
                  id="EmpId"
                  mask="99999"
                  v-model="state.empId"
                  style="text-align: end"
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
            {{ selectedPermissions }}
            <div class="field col-12 md:col-6 lg:col-4">
              <span class="p-float-label">
                <div class="card flex justify-content-center">
                  <MultiSelect
                    v-model="selectedPermissions"
                    display="chip"
                    optionValue="value"
                    :options="permissions"
                    optionLabel="name"
                    placeholder="Select permissions"
                    :maxSelectedLabels="3"
                    class="w-full md:w-20rem"
                  />
                  <label for="startDate">اختر الصلاحيات</label>
                </div>
                <!-- <div style="height: 2px">
                  <error
                    v-for="error in v$.selectedCities.$errors"
                    :key="error.$uid"
                    class="p-error"
                  >
                    {{ error.$message }}</error
                  >
                </div> -->
              </span>
            </div>
          </div>
          <Button
            class="p-button-primry"
            icon="fa-solid fa-plus"
            label="إضافة"
            type="submit"
            :loading="loading"
          />
          <Button
            @click="resetForm"
            icon="fa-solid fa-delete-left"
            label="مسح"
            class="p-button-danger"
            style="margin-right: 0.5em"
          />
          <Toast position="bottom-left" />
        </form>
      </template>
    </Card>
  </div>
</template>

<style>
.error {
  font-size: 12px;
  font-weight: bold;
}

.p-dropdown {
  border-radius: 10px;
}

.p-float-label > label {
  right: 0.5rem;
  color: #6c757d;
  transition-duration: 0.2s;
}

/* .menuitem-content:hover {

} */
</style>
