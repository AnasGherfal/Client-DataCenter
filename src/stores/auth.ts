import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { admin } from "@/api/admin";
import { authApi } from "@/api/auth";
import { ProfileResponse } from "../Modules/Profile/ProfileResponse";

export const useAuthStore = defineStore("user", () => {
  // const userData = ref<ProfileResponse>();
  const userData = ref({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    empId: "1234",
    displayName:"admin",
    email:"admin@gmail.com",
    permissions:"511"

  })
  const prem = ref(511)
  const loading = ref(false);


  //Commented to avoid authentication with backend
  const getProfile = async () => {
    // try {
    //   loading.value = true;
    //   const response = await authApi.profile();
    //   userData.value = response.data.content;
    //   prem.value = response.data.content.permissions;
    //   return response.data.content;
    // } catch (error) {
    //   (error);
    //   return null;
    // } finally {
    //   loading.value = false;
    // }
  };
  return {
    userData,
    getProfile,
    prem,
    loading,
  };
});
