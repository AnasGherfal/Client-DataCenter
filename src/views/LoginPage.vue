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
        localStorage.setItem("token", token);

        router.push({ name: "home" });
        toast.add({
          severity: "success",
          summary: "رسالة نجاح",
          detail: response.data.msg,
          life: 3000,
        });
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "رسالة خطأ",
          detail: error.response.data.msg,
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
  <!-- <div class="backColor"

        "></div> -->
  <div class="background">
    <div class="shape"></div>

    <div class="shape"></div>
  </div>
  <form @submit.prevent="submitForm">
    <h3 style="color: rgb(27, 23, 23)">تسجيل الدخول</h3>

    <div class="grid p-fluid">
      <div class="field col-12 md:col-12 lg:col-12">
        <span class="p-input-icon-left">
          <InputText
            id="email"
            placeholder="البريد الالكتروني"
            type="email"
            v-model="credentials.email"
            style="background-color: white; color: black"
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
      :loading="loading"
    />
  </form>
  <div id="backg"></div>
  <Toast position="bottom-left" />
</template>

<style scoped>
/* Your CSS styles here */
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  background-color: hsl(247, 39%, 5%);
}

.backColor{
  background-color: hsl(247, 39%, 5%);
  background-size: cover;
  margin: 0;
  height: 100vh;
  overflow: hidden; /* Prevents scrolling */
}
.background {
  width: 430px;
  height: 520px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.background .shape {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}
.shape:first-child {
  background: linear-gradient(#1845ad, #23a2f6);
  left: -80px;
  top: -80px;
}
.shape:last-child {
  background: linear-gradient(to right, #ff512f, #f09819);
  right: -30px;
  bottom: -80px;
}
form {
  height: 520px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}
form * {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}
form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}
label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}
::placeholder {
  color: #e5e5e5;
}
button {
  margin-top: 50px;
  width: 100%;
  background-color: white;
  color: rgb(0, 0, 0);
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
}
.social {
  margin-top: 30px;
  display: flex;
}
.social div {
  background: red;
  width: 150px;
  border-radius: 3px;
  padding: 5px 10px 10px 5px;
  background-color: rgba(255, 255, 255, 0.27);
  color: #eaf0fb;
  text-align: center;
}
.social div:hover {
  background-color: rgba(255, 255, 255, 0.47);
}
.social .fb {
  margin-left: 25px;
}
.social i {
  margin-right: 4px;
}
</style>
