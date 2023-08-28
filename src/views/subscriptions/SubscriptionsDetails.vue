<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Knob from "primevue/knob";
import type { Service } from "../../Modules/ServicesModule/ServicesModule";
import BackButton from "@/components/BackButton.vue";
import type { SubscriptionRespons } from "../../Modules/SubscriptionModule/SubscriptionsResponseModule";
import { useToast } from "primevue/usetoast";
import { useSubscriptionsStore } from "@/stores/subscriptions";
import { subscriptionApi } from "@/api/subscriptions";
import { serviceApi } from "@/api/service";
import { useRoute } from "vue-router";
import CircularProgressBar from "@/assets/style/CircularProgressBar.vue";
import VisitBysubsId from "../Visits/VisitBysubsId.vue";
import router from "@/router";

const loading = ref(false);
const loading2 = ref(false);
const cardVis = ref(false);
const prop = defineProps<{
  nad: number;
}>();
const store = useSubscriptionsStore();
const toast = useToast();
const route = useRoute();

const subs: SubscriptionRespons = reactive({
  id: null,
  status: null,
  serviceName: "",
  customerName: "",
  startDate: "",
  endDate: "",
  subscriptionFileId: null,
  daysRemaining: 0,
  visits: [],
  file: { id: "", fileName: "", docType: "" },
});

const servobj: Service = reactive({
  id: null,
  name: "",
  amountOfPower: "",
  acpPort: "",
  dns: "",
  monthlyVisits: 0,
  price: null,
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
      subs.id = response.data.id;
      subs.status = response.data.status;
      subs.customerName = response.data.customerName;
      subs.endDate = response.data.endDate;
      subs.startDate = response.data.startDate;
      subs.serviceName = response.data.serviceName;
      subs.subscriptionFileId = response.data.subscriptionFileId;
      subs.daysRemaining = response.data.daysRemaining;
      subs.visits = response.data.visits;
      subs.file.fileName = response.data.file.fileName;
      subs.file.docType = response.data.file.docType;
      subs.file.id = response.data.file.id;
    })
    .then(function () {
      serviceApi
        .get()
        .then(function (response) {
          servobj.id = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].id;
          servobj.acpPort = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].acpPort;
          servobj.dns = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].dns;
          servobj.amountOfPower = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].amountOfPower;
          servobj.name = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].name;
          servobj.monthlyVisits = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].monthlyVisits;
          servobj.price = response.data.content.filter(
            (servic: { name: string }) => servic.name === subs.serviceName
          )[0].price;
          loading.value = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
      loading.value = false;
    });
}

const customersDialog = ref(false);
const formData = new FormData();

async function onFileUpload(event: any, index: number) {
  const fileInput = event.target as HTMLInputElement;
  const files = fileInput.files;

  if (files && formData) {
    const fileObject = files[0];

    if (fileObject) {
      // Store the File object in the ref
      file.value = fileObject;

      // Append the File object to formData
      const fieldName = index === 0 ? "File" : "File";
      formData.append(fieldName, fileObject);
    }
  }
}

const displayedFileName = computed(() => {
  return file.value?.name  || "ارفق ملف 1";
});

const file = ref<File | null>();
const firstFileError = ref<string | null>(null);

const renewalSubscription = () => {
  loading2.value = true;

  if (!formData.get("File")) {
    firstFileError.value = "الحقل مطلوب";
    loading2.value = false;
    return; // Stop further processing
  } else {
    firstFileError.value = "";
    if (file instanceof File) {
      formData.append("file", file, file.name);
    }

    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    console.log("formData:", formDataObject);
    subscriptionApi
      .renew(subs.id, formData)
      .then((response) => {
        console.log(response);
        loading2.value = false;
        toast.add({
          severity: "success",
          summary: "تم التجديد",
          detail: response,
          life: 3000,
        });
        customersDialog.value = false;
        router.go(-1);
        store.getSubs();
      })
      .catch(function (error) {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "حدثة مشكلة",
          detail: error,
          life: 3000,
        });
        loading2.value = false;
      });
  }
};

function car() {
  cardVis.value = !cardVis.value;
}

const downloadFile = async (id: any) => {
  try {
    const response = await subscriptionApi.getFile(id, {
      responseType: "arraybuffer",
    });

    if (response) {
      const blob = new Blob([response.data], {
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
const maxDays = ref(400); // Set the maximum value for the knob
</script>

<template>
  <card>
    <template #title>
      بيانات الاشتراك

      <BackButton style="float: left" />

      <Divider />
    </template>

    <template #content>
      <div v-if="subs.status == 5">
        <div class="warning-message">
          <div class="warning-message-icon"></div>
          <div class="warning-message-text">
            هذه الخدمة مقفلة لا يمكن تجديدها او اضافة شيء عليها
          </div>
        </div>
      </div>

      <div class="grid p-fluid">
        <div v-if="loading">
          <div class="grid p-fluid">
            <div v-for="n in 1" class="ml-3 mb-2">
              <span>
                <Skeleton width="15rem" height="20rem"></Skeleton>
              </span>
            </div>
          </div>
        </div>

        <div v-else class="flex-1" style="text-align: center; width: 20rem">
          <div v-if="subs.daysRemaining > 0" style="display: inline-block">
            <CircularProgressBar :percentage="subs.daysRemaining" />
          </div>
          <div v-else style="display: inline-block">
            <CircularProgressBar :percentage="0" />
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
              <div v-if="subs.status !== 5">
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
            <div v-else-if="subs.daysRemaining <= 0 && subs.status !== 5">
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
            <div v-else-if="subs.daysRemaining <= 0 && subs.status !== 5">
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

                      {{ displayedFileName }}
                    </div>
                  </div>

                  <input
                    id="fileInput"
                    style="display: none"
                    type="file"
                    @change="(event) => onFileUpload(event, 0)"
                    accept="*"
                  />
                </label>
                <div
                  v-if="firstFileError"
                  style="color: red; font-weight: bold; font-size: small"
                >
                  {{ firstFileError }}
                </div>
              </div>
            </div>
            <template #footer>
              <Button
                label="لا"
                icon="pi pi-times"
                text
                @click="customersDialog = false"
              />
              <Button
                label="نعم"
                icon="pi pi-check"
                :loading="loading2"
                text
                @click="renewalSubscription"
              />
            </template>
          </Dialog>
        </div>
        <Divider class="p-divider-solid" layout="vertical" />

        <div class="flex-1">
          <h3 style="margin: 0">اسم العميل</h3>
          <Skeleton v-if="loading" width="100%" height="1rem"></Skeleton>

          <span v-else="loading">
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

          <span v-else="loading">
            <p style="margin: 0; display: inline">{{ subs.serviceName }}</p>

            <Button
              @click="car()"
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
                      servobj.name
                    }}</span>
                    <div class="text-center mb-3">
                      عدد الزيارات المتاحة في هذه الباقة في الشهر :
                      {{ servobj.monthlyVisits }}
                    </div>
                    <div class="text-center font-semibold text-4xl">
                      {{ servobj.price
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
                  <span>(Acp Port): {{ servobj.acpPort }}</span>
                  <span class="font-medium"></span>
                </div>

                <div class="text-center font-semibold text-sm">
                  <span>DNS : {{ servobj.dns }}</span>
                  <i class="text-green-600 fa-solid fa-circle-check mr-2"></i>
                  <span class="font-medium"></span>
                </div>

                <div
                  style="direction: ltr"
                  class="text-center font-bold text-sm"
                >
                  <i class="text-green-600 fa-solid fa-circle-check mr-1"></i>
                  <span> (Amount Of Power) : {{ servobj.amountOfPower }} </span>
                  <span class="text-green-500 font-medium"></span>
                </div>
              </div>
            </Dialog>
          </span>

          <Divider class="p-divider-solid" layout="horizontal" />

          <h4 style="margin: 0">عدد الزيارات المتبقية بالساعة</h4>
          <Skeleton v-if="loading" width="50%" height="1rem"></Skeleton>
          <ProgressBar class="mt-2" v-else :value="servobj.monthlyVisits">
            {{ servobj.monthlyVisits }}
          </ProgressBar>

          <Divider class="p-divider-solid" layout="horizontal" />

          <h4 style="margin: 0; margin-bottom: 2rem">عقد الاشتراك :</h4>
          <Skeleton v-if="loading" width="50%" height="1rem"></Skeleton>

          <div class="grid p-fluid">
            <div class="field col-4 md:col-4 lg:col-6">
              <span class="p-float-label">
                <InputText
                  class="p-inputtext p-component"
                  v-model="subs.file.fileName"
                  :disabled="true"
                />

                <label for="secondaryPhone">اسم الملف</label>
              </span>
            </div>
            <!-- <div class="field col-4 md:col-4 lg:col-4">
              <span class="p-float-label">
                <Dropdown
                  id="docType"
                  class="custom-dropdown"
                  v-model="subs.file.docType"
                  :disabled="true"
                />
                <label for="secondaryPhone">نوع الملف</label>
              </span>
            </div> -->
            <div class="file-actions field col-4 md:col-4 lg:col-6">
              <Button
                v-if="subs.status == 5"
                @click="downloadFile(subs.file.id)"
                icon="fa-solid fa-download"
                class="p-button-text p-button-info"
                disabled="true"
              >
                تحميل
              </Button>
              <Button
                v-else
                @click="downloadFile(subs.file.id)"
                icon="fa-solid fa-download"
                class="p-button-text p-button-info"
              >
                تحميل
              </Button>
              <Button
                icon="fa-solid fa-eye"
                class="p-button-text p-button-info"
              >
                عرض
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="card">
        <TabView ref="tabview4" class="tabview-custom">
          <TabPanel>
            <template #header>
              <i class="fa-solid fa-book mr-2"></i>
              <span> سجل زيارات هذا الاشتراك </span>
            </template>
            <VisitBysubsId :visits="subs.visits"></VisitBysubsId>
          </TabPanel>

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
        </TabView>
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
