<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { user } from "@/api/user";
import { toNumber } from "@vue/shared";
import type { RequestUserModel } from "@/Models/UserModel/RequestUserModel";
import { useUserStor } from "../../stores/user";
import InfoUser from "./InfoUser.vue";

const route = useRoute();

const store = useUserStor();

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return toNumber(route.params.id);
  } else {
    return null; // or return a default value if id is not available
  }
});

console.log(userId.value);

const userDate: RequestUserModel = reactive({
  id: null,
  fullName: "",
  empId: null,
  permisssions: null,
  status: null,
  password: "",
});

onMounted(async () => {
  user
    .getById(userId.value)
    .then(function (response) {
      console.log(response.data);
      userDate.id = response.data.id;
      userDate.empId = response.data.empId;
      userDate.fullName = response.data.fullName;
      userDate.password = response.data.password;
      userDate.status = response.data.status;
      userDate.permisssions = response.data.permisssions;
    })
    .catch(function (error) {
      console.log(error);
    });
});
console.log(userDate);
</script>

<template>
  <InfoUser :user="userDate" :key="userId" @getUser="store.getUser" />
  <card class="shadow-2 p-3 mt-3 border-round-2xl">
    <template #content>
      <TabView class="tabview-custom" ref="tabview4">
        <TabPanel>
          <template #header>
            <i class="fa-solid fa-key ml-2"></i>
            <span>الصلاحيات</span>
          </template>
          <h3>الصلاحيات:</h3>
          <div class="grid">
            <div class="col-2">اسم البيانات</div>
            <div class="col text-center">انشاء</div>
            <div class="col text-center">تعديل</div>
            <div class="col text-center">قفل/إلغاء</div>
            <div class="col text-center">عرض</div>
            <div class="col text-center">حذف</div>
            <div class="col text-center">تجديد</div>
          </div>
          <div v-for="r in 3" class="grid mb-2">
            <div class="col-2 font-semibold">العملاء</div>
            <div class="col text-center">
              <i class="fa-regular fa-circle-xmark" style="color: #e90c0c"></i>
            </div>
            <div class="col text-center">
              <i class="fa-regular fa-circle-check" style="color: #2cbd0f"></i>
            </div>
            <div class="col text-center">
              <i class="fa-regular fa-circle-check" style="color: #2cbd0f"></i>
            </div>
            <div class="col text-center">
              <i class="fa-regular fa-circle-check" style="color: #2cbd0f"></i>
            </div>
            <div class="col text-center">
              <i class="fa-regular fa-circle-xmark" style="color: #e90c0c"></i>
            </div>
            <div class="col text-center">
              <i class="fa-solid fa-minus" style="color: #616161"></i>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="fa-solid fa-bars ml-2"></i>
            <span>سجل الحركات</span>
          </template>
          <!-- الخدمات الخاصة بالعميل -->
        </TabPanel>
      </TabView>
    </template>
  </card>
</template>

<style></style>
