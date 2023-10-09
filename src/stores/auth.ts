import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { admin } from "@/api/admin";
import { authApi } from "@/api/auth";
import { ProfileResponse } from "../Modules/Profile/ProfileResponse";

export const useAuthStore = defineStore("user", () => {
  const userData = ref<ProfileResponse>();
  const loading = ref(false);

  const getProfile = async () => {
    try {
      loading.value = true;
      const response = await authApi.profile();
      userData.value = response.data.content;
      return response.data.content;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      loading.value = false;
    }
  };
  return {
    userData,
    getProfile,
    loading,
  };
});
