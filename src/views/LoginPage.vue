<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import Password from "primevue/password";
import { authApi } from "@/api/auth";
import { useRouter } from "vue-router";
import { email, helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useToast } from "primevue/usetoast";

const credentials = reactive({
  email: "",
  password: "",
});
const toast = useToast();
const router = useRouter();
const loading = ref(false);


const submitForm = async () => {
  const result = await v$.value.$validate();
  if (result) {
    loading.value = true;
    authApi
      .login(credentials)
      .then((response) => {
        // Store the token if the login is successful
        const token = response.data.content.accessToken;
        localStorage.setItem("token",token)

        router.push({ name: "home" });
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "رسالة خطأ",
          detail: "Validation failed",
          life: 3000,
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("البريد الأكتروني مطلوب", required),
      email: helpers.withMessage(" ليس عنوان بريد إلكتروني صالح", email),
    },
    password: { required: helpers.withMessage("كلمة المرور مطلوبة", required) },
  };
});
const v$ = useVuelidate(rules, credentials);
</script>

<template>
  <div id="backg">
    <div class="surface-card p-4 shadow-2 border-round w-full">
      <div class="text-center mb-5">
        <img
          src="../assets/pics/LTT-logo.png"
          alt="Image"
          height="90"
          class="mb-3"
        />
        <div class="text-900 text-3xl font-medium mb-3">مرحبا بك مجددا !</div>
        <span class="text-600 font-medium line-height-3"
          >نظام ادارة الزيارات الخاص بمركز الخدمات يرجى ادخال البريد الإلكتروني
          وكلمة المرور
        </span>
      </div>

      <div class="grid p-fluid">
        <div class="field col-12 md:col-12 lg:col-12">
          <span class="p-input-icon-left">
            <InputText
              id="email"
              name="email"
              placeholder="البريد الالكتروني"
              type="email"
              v-model="credentials.email"
            />
            <div style="height: 2px">
              <span
                v-for="error in v$.email.$errors"
                :key="error.$uid"
                style="color: red; font-weight: bold; font-size: small"
              >
                {{ error.$message }}</span
              >
            </div>
          </span>
        </div>
        <div class="field col-12 md:col-12 lg:col-12">
          <span class="p-input-icon-left">
            <Password
              v-model="credentials.password"
              placeholder="كلمة المرور"
              :feedback="false"
            />
            <div style="height: 2px">
              <span
                v-for="error in v$.password.$errors"
                :key="error.$uid"
                style="color: red; font-weight: bold; font-size: small"
              >
                {{ error.$message }}</span
              >
            </div>
          </span>
        </div>
      </div>
      <Button
        @click="submitForm"
        class="p-button-primry mt-3"
        style="width: 100%"
        label="تسجيل دخول"
        type="submit"
        :loading="loading"
      />
    </div>
    <Toast position="bottom-left" />
  </div>
</template>

<style scoped>
#backg {
  background: linear-gradient(
    45deg,
    hsla(204, 59%, 51%, 1) 0%,
    hsla(204, 100%, 91%, 1) 51%,
    hsla(0, 0%, 100%, 1) 100%
  );
  padding-left: 25%;
  padding-right: 25%;
  padding-top: 5%;
  padding-bottom: 5%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
h2 {
  color: #1643a0;
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
}
p {
  color: gray;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
}
.p-input-icon-right > i:last-of-type {
  right: 10.8rem;
  color: black;
}
.LTT {
  width: 80px;
  margin-right: 50%;
}
</style>
