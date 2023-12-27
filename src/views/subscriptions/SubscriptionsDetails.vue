<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { Service } from "../../Modules/ServicesModule/ServicesModule";
import BackButton from "@/components/BackButton.vue";
import { useToast } from "primevue/usetoast";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import { subscriptionApi } from "@/api/subscriptions";
import { serviceApi } from "@/api/service";
import { useRoute } from "vue-router";
import CircularProgressBar from "@/assets/style/CircularProgressBar.vue";
import VisitBysubsId from "../Visits/VisitBySubsId.vue";
import router from "@/router";
import moment from "moment";
import { visitApi } from "@/api/visits";

const loading = ref(false);
const loading2 = ref(false);
const cardVis = ref(false);
const RenewFile = ref<File>();
const customersDialog = ref(false);
const service = ref<Service>();

const store = useSubscriptionsStore();
const toast = useToast();
const route = useRoute();

const subs = reactive({
  id: "",
  status: 0,
  serviceName: "",
  customerName: "",
  startDate: "",
  endDate: "",
  subscriptionFileId: null,
  daysRemaining: 0,
  monthlyVisits: 0,
  visits: [] as any,
  file: [
    {
      createdOn: "",
      fileType: 0,
      isActive: true,
      id: "",
    },
  ],
  totalPrice: 0,
  createdOn: "",
});

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return String(route.params.id); // Convert the ID to a number
  } else {
    return ""; // or return a default value if id is not available, such as -1
  }
});

onMounted(async () => {
  getdata();
});
function getdata() {
  loading.value = true;
  subscriptionApi
    .getById(userId.value)
    .then(function (response) {
      const content = response.data.content;
      subs.id = content.id;
      subs.status = content.status;
      subs.customerName = content.customerName;
      subs.endDate = content.endDate;
      subs.startDate = content.startDate;
      subs.serviceName = content.serviceName;
      subs.file = content.files;
      subs.createdOn = content.createdOn;
      subs.totalPrice = content.totalPrice;
      const daysRemaining = moment(content.endDate).diff(moment(), "days");
      subs.daysRemaining = Math.max(0, daysRemaining); // Set to 0 if daysRemaining is negative
        })
    .then(function () {
      serviceApi.get().then(function (response) {
        service.value = response.data.content.find(
          (servic: any) => servic.name === subs.serviceName
        );
      });
    })
    .finally(() => {
      loading.value = false;
    });
}



async function onRenewFileUpload(event: any) {
  const file = event.target.files[0];

  RenewFile.value = file;
}

const renewalSubscription = () => {
  loading2.value = true;

  const formData = new FormData();
  formData.append("file", RenewFile.value as File);

  subscriptionApi
    .renew(subs.id, formData)
    .then((response) => {
      loading2.value = false;
      toast.add({
        severity: "success",
        summary: "تم التجديد",
        detail: response,
        life: 3000,
      });
      customersDialog.value = false;
      router.go(-1);
    })
    .catch(function (error) {
      toast.add({
        severity: "error",
        summary: error.response.data.msg || "حدثة مشكلة",
        detail: error,
        life: 3000,
      });
      loading2.value = false;
    })
    .finally(() => {
      loading2.value = false;
    });
};

function car() {
  cardVis.value = !cardVis.value;
}
// function visitPercent() {
//   if (service && service?.monthlyVisits) {
//     return (subs.monthlyVisits / service?.monthlyVisits) * 100;
//   }
//   return 0; // Default value in case service.monthlyVisits is falsy
// }
const downloadFile = async (subId: string, fileId: string) => {
  try {
    const response = await subscriptionApi.getFile(subId, fileId);

    if (response) {
      const blob = new Blob([response.data.content], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded_file.png"; // Set the desired downloaded filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } else {
      console.error("Invalid file response");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء تحميل الملف",
      life: 3000,
    });
  }
};
</script>

<template>
  <card>
    <template #title>
      بيانات الاشتراك

      <BackButton style="float: left" />

      <Divider />
    </template>

    <template #content>
      <div v-if="subs.status == 2">
        <div class="warning-message">
          <div class="warning-message-icon"></div>
          <div class="warning-message-text">
            هذا الاشتراك مقفل لا يمكن التجديد 
          </div>
        </div>
      </div>

      <div class="grid p-fluid">
        <div v-if="loading">
          <div class="grid p-fluid">
            <div v-for="n in 4" :key="n" class="ml-3 mb-2">
              <span>
                <Skeleton width="15rem" height="20rem"></Skeleton>
              </span>
            </div>
          </div>
        </div>

        <div v-else class="flex-1" style="text-align: center; width: 20rem">
          <div style="display: inline-block">
            <CircularProgressBar :percentage="subs.daysRemaining" />
          </div>

          <div>
            <h2>الأيام المتبقية</h2>
            <!-- <h3 v-else class="text-red-800">انتهت صلاحية هذه الخدمة</h3> -->

            <div
              v-if="
                subs.daysRemaining < 30 &&
                subs.daysRemaining !== 0 &&
                subs.daysRemaining > 0
              "
            >
              <h3 class="text-red-600">هذا الاشتراك قارب على الانتهاء</h3>
              <div v-if="subs.status !== 2">
                <h5 class="text-red-600" style="margin-bottom: 5px">
                  اضغط على الأيقونة للتجديد
                </h5>
                <Button
                  icon="fa-solid fa-repeat"
                  severity="danger"
                  text
                  rounded
                  aria-label="Cancel"
                  @click="customersDialog = true"
                />
              </div>
            </div>

            <div v-else-if="subs.daysRemaining <= 0 && subs.status !== 2">
              <h3 class="text-red-600">هذا الاشتراك انتهى</h3>

              <h5 class="text-red-600" style="margin-bottom: 5px">
                اضغط على الأيقونة للتجديد
              </h5>
              <Button
                icon="fa-solid fa-repeat"
                severity="danger"
                text
                rounded
                aria-label="Cancel"
                @click="customersDialog = true"
              />
            </div>
          </div>
          <Dialog
            v-model:visible="customersDialog"
            :style="{ width: '450px', height: 'auto', overflow: 'hidden' }"
            header="تجديد الاشتراك"
            :modal="true"
          >
            <div class="confirmation-content">
              <i class="fa-solid fa-repeat mr-3" style="color: green" />
              <span>هل انت متأكد من تجديد الاشتراك؟</span>
            </div>
            <div class="grid p-fluid">
              <div class="field col-4 md:col-4 lg:col-6">
                <label class="file-input-label" for="fileInput">
                  <div class="file-input-content">
                    <div class="file-input-icon"></div>

                    <div class="file-input-text">
                      <i class="pi pi-upload"></i>

                      {{ RenewFile ? RenewFile.name : "ارفق ملف 1" }}
                    </div>
                  </div>

                  <input
                    id="fileInput"
                    style="display: none"
                    type="file"
                    @change="(event) => onRenewFileUpload(event)"
                    accept="*"
                  />
                </label>
              </div>
            </div>
            <template #footer>
              <Button
                label="نعم"
                icon="pi pi-check"
                :loading="loading2"
                text
                @click="renewalSubscription"
              />
              <Button
                label="لا"
                icon="pi pi-times"
                text
                @click="customersDialog = false"
              />
            </template>
          </Dialog>
        </div>
        <Divider class="p-divider-solid" layout="vertical" />

        <div class="flex-1">
          <h3 style="margin: 0">اسم العميل</h3>
          <Skeleton v-if="loading" width="100%" height="1rem"></Skeleton>

          <span v-else>
            <p style="margin: 0; display: inline">{{ subs.customerName }}</p>
            <RouterLink
              :key="subs.customerName"
              :to="'/subscriptionsRecord/SubscriptionsDetaView/' + '1'"
              style="text-decoration: none"
            >
              <!-- <Button
                icon="fa-solid fa-circle-info"
                severity="info"
                text
                rounded
                v-tooltip="{ value: 'التفاصيل', fitContent: true }"
                style="display: flex; float: left; width: 2rem; height: 1rem"
              /> -->
            </RouterLink>
          </span>
          <Divider class="p-divider-solid" layout="horizontal" />

          <h3 style="margin: 0">اسم الباقة</h3>
          <Skeleton v-if="loading" width="50%" height="1rem"></Skeleton>

          <span v-else>
            <p style="margin: 0; display: inline">{{ subs.serviceName }}</p>

            <Button
              @click="car"
              icon="fa-solid fa-circle-info"
              severity="info"
              text
              rounded
              v-tooltip="{ value: 'التفاصيل', fitContent: true }"
              style="display: flex; float: left; width: 2rem; height: 1rem"
            />

            <Dialog v-model:visible="cardVis" :modal="true">
              <div style="height-min: 450px">
                <div class="justify-content-between">
                  <div>
                    <span class="block text-center text-3xl font-bold">{{
                      service?.name
                    }}</span>
                    <div class="text-center mb-3">
                      عدد الزيارات المتاحة في هذه الباقة في الشهر :
                      {{ service?.monthlyVisits }}
                    </div>
                    <div class="text-center font-semibold text-4xl">
                      {{ service?.price
                      }}<span class="text-xs mr-1 text-blue-800">د.ل</span>
                    </div>
                  </div>
                  <Divider />
                </div>
                <p class="font-bold">خواص هذه الباقة :</p>

                <div
                  style="direction: ltr"
                  class="text-center font-bold text-sm"
                >
                  <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
                  <span>(Acp Port): {{ service?.acpPort }}</span>
                  <span class="font-medium"></span>
                </div>

                <div class="text-center font-semibold text-sm">
                  <span>DNS : {{ service?.dns }}</span>
                  <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
                  <span class="font-medium"></span>
                </div>

                <div
                  style="direction: ltr"
                  class="text-center font-bold text-sm"
                >
                  <i class="text-green-600 fa-solid fa-circle-check mr-1"></i>
                  <span>
                    (Amount Of Power) : {{ service?.amountOfPower }}
                  </span>
                  <span class="text-green-500 font-medium"></span>
                </div>
              </div>
            </Dialog>
          </span>

          <Divider class="p-divider-solid" layout="horizontal" />

          <h4 style="margin: 0">عدد الزيارات المتبقية بالساعة</h4>
          <Skeleton v-if="loading" width="50%" height="1rem"></Skeleton>
          <ProgressBar class="mt-2" v-else :value="20">
            {{ service?.monthlyVisits }}
          </ProgressBar>

          <Divider class="p-divider-solid" layout="horizontal" />

          <h4 style="margin: 0; margin-bottom: 2rem">عقد الاشتراك :</h4>
          <Skeleton v-if="loading" width="50%" height="1rem"></Skeleton>

          <div
            v-for="(item, index) in subs.file"
            :key="index"
            class="grid p-fluid align-items-center"
          >
            <div class="field col-4 md:col-4 lg:col-6">
              <span class="">
                <label for="secondaryPhone">اسم الملف</label>
                <InputText
                  class="p-inputtext p-component"
                  :value="item.id"
                  :disabled="true"
                />
              </span>
            </div>

            <div class="file-actions field col-4 md:col-4 lg:col-6">
              <Button
                @click="downloadFile(subs.id, item.id)"
                icon="fa-solid fa-download"
                class="p-button-text p-button-info"
              >
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="card">
        <!-- <TabView ref="tabview4" class="tabview-custom"> -->
          <!-- <TabPanel>
            <template #header>
              <i class="fa-solid fa-book mr-2"></i>
              <span> سجل زيارات هذا الاشتراك </span>
            </template>
            <VisitBysubsId :visits="subs.visits"></VisitBysubsId>
          </TabPanel> -->

          <!-- <TabPanel>
            <template #header>
              <i class="fa-solid fa-toolbox mr-2"></i>
              <span> معدات هذا الاشتراك</span>
            </template>
            سجل زيارات هذه الخدمة
          </TabPanel> -->

          <!-- <TabPanel>
            <template #header>
              <i class="fa-solid fa-circle-plus ml-2"></i>
              <span>اضافة Acp Port</span>
            </template>
          </TabPanel>
          <TabPanel>
            <template #header>
              <i class="fa-solid fa-circle-plus mr-2"></i>
              <span>اضافة DNS</span>
            </template>
          </TabPanel> -->
        <!-- </TabView> -->
      </div>
    </template>
  </card>
</template>

<style>
.mr-2 {
  margin-left: 0.5rem !important;
}
.warning-message {
  display: flex;
  align-items: center;
  background-color: #ffeeba;
  color: #856404;
  padding: 8px;
  border: 1px solid #ffeeba;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.warning-message-icon {
  width: 24px;
  height: 24px;
  background-color: #ffc107;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.warning-message-icon:before {
  content: "!";
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}

.warning-message-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.progress-knob {
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.file-input-label {
  display: inline-block;
  position: relative;
  overflow: hidden;
  font-family: tajawal;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  color: #708da9;
  border: 1px solid #d3dbe3;
  text-align: center;
  padding: 0.7rem;
  cursor: pointer;
}
.file-input-label::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
