<script setup lang="ts">
import { onMounted, ref } from "vue";
import editservice from "./EditService.vue";
import DeletService from "./DeleteService.vue";
import AddService from "./AddService.vue";
import LockButton from "../../../components/LockButton.vue";
import { serviceApi } from "../../../api/service";

const loading = ref(true);
const packagesList = ref();
onMounted(async () => {
  serviceApi
    .get()
    .then((response) => {
      packagesList.value = response.data.content;
      loading.value = false;
    })
    .catch(function (error) {
      console.log(error);
      loading.value = false;
    });
});

function getList() {
  serviceApi.get().then((resp) => {
    packagesList.value = resp.data.content;
  });
}
</script>

<template>
  <div>
    <AddService @getList="getList" />
  </div>
  <div class="grid">
    <div v-if="loading">
      <div class="grid p-fluid">
        <div v-for="n in 2" class="ml-3 mb-2">
          <span>
            <Skeleton width="15rem" height="25rem"></Skeleton>
          </span>
        </div>
      </div>
    </div>

    <div
      v-for="servic in packagesList"
      :key="servic.id"
      class="col-12 md:col-6 lg:col-4"
    >
      <card>
        <template #header>
          <editservice
            v-if="servic.status !== 5"
            :pakge="servic"
            @getList="getList"
          />

          <LockButton
            typeLock="Service"
            :id="servic.id"
            :name="servic.name"
            :status="servic.status"
            @getdata="getList"
          />
          <DeletService
            v-if="servic.status !== 5"
            :pakge="servic"
            :key="servic.id"
            @getList="getList"
          />
        </template>
        <template #content>
          <div style="height-min: 450px">
            <div class="justify-content-between">
              <div>
                <span class="block text-center text-3xl font-bold">{{
                  servic.name
                }}</span>
                <div class="text-center mb-3">
                  عدد الزيارات المتاحة في هذه الباقة في الشهر :
                  {{ servic.monthlyVisits }}
                </div>
                <div class="text-center font-semibold text-4xl">
                  {{ servic.price
                  }}<span class="text-xs mr-1 text-blue-800">د.ل</span>
                </div>
              </div>
              <Divider />
            </div>
            <p class="font-bold">خواص هذه الباقة :</p>

            <div style="direction: ltr" class="text-center font-bold text-sm">
              <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
              <span>(Acp Port): {{ servic.acpPort }}</span>
              <span class="font-medium"></span>
            </div>

            <div class="text-center font-semibold text-sm">
              <span>DNS : {{ servic.dns }}</span>
              <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
              <span class="font-medium"></span>
            </div>

            <div style="direction: ltr" class="text-center font-bold text-sm">
              <i class="text-green-600 fa-solid fa-circle-check mr-1"></i>
              <span> (Amount Of Power) : {{ servic.amountOfPower }} </span>
              <span class="text-green-500 font-medium"></span>
            </div>
          </div>
        </template>
      </card>
    </div>
  </div>
</template>

<style scoped></style>
