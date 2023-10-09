<script setup lang="ts">
import { authApi } from "@/api/auth";
import BackButton from "@/components/BackButton.vue";
import ChangePasswordUser from "@/components/User/ChangePasswordUser.vue";
import { onMounted, reactive } from "vue";

const state = reactive({
  name: "" as string,
  email: "",
  EmpId: 0,
});

onMounted(() => {
  authApi.profile().then((response) => {
    state.name = response.data.content.displayName;
    state.email = response.data.content.email;
    state.EmpId = response.data.content.empId;
  });
});
</script>

<template>
  <div>
    <card>
      <template #title>
        بيانات الموظف
        <BackButton style="float: left" />
        <Divider />
      </template>
      <template #content>
        <div class="grid p-fluid">
          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputNumber
                id="address"
                mask="99999"
                type="text"
                v-model="state.EmpId"
                :disabled="true"
              />
              <label
                style="color: black; top: -0.75rem; font-size: 12px"
                for="address"
                >الرقم الوظيفي</label
              >
            </span>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="name"
                type="text"
                :value="state.name"
                :disabled="true"
              />
              <label
                style="color: black; top: -0.75rem; font-size: 12px"
                for="name"
                >اسم
              </label>
            </span>
          </div>

          <div class="field col-12 md:col-6">
            <span class="p-float-label">
              <InputText
                id="email"
                type="text"
                v-model="state.email"
                disabled="true"
              />
              <label
                style="color: black; top: -0.75rem; font-size: 12px"
                for="email"
                >البريد الإلكتروني</label
              >
            </span>
          </div>

          <ChangePasswordUser />
        </div>
      </template>
    </card>
  </div>
</template>
