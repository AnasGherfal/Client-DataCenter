<script setup lang="ts">
import InfoCustomer from "./CustomerDetails.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Representative from "./Representatives/Representatives.vue";
import DeleteRepresentives from "./Representatives/DeleteRepresentatives.vue";
import EditRepresentatives from "./Representatives/EditRepresentatives.vue";
import { useCustomersStore } from "@/stores/customers";
import SubscriptionByCustomerId from "@/views/subscriptions/SubscriptionByCustomerId.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import { representativesApi } from "@/api/representatives";
import type { Customer } from "@/Modules/CustomerModule/CustomersModule";
import { formattedPhoneNumber } from "@/tools/phoneUtils";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const store = useCustomersStore();
const loading = ref(false);
const hide1 = ref(false);
const hide2 = ref(false);
const displayDialog = ref(false);
const reprefileType1 = ref();
const reprefileType2 = ref();

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return String(route.params.id); // Convert the ID to a number
  } else {
    return ""; // or return a default value if id is not available, such as -1
  }
});
const customerId: Customer = reactive({
  name: "",
  email: "",
  address: "",
  primaryPhone: "",
  secondaryPhone: "",
  files: [
    { file: null, docType: 0 },
    { file: null, docType: 0 },
  ],
  subsicrptions: "",
  representative: [],
});

const openDialog = () => {
  displayDialog.value = true;
};
const closeDialog = () => {
  displayDialog.value = false;
};
const representativeId = ref();
const representatives = ref();

onMounted(async () => {
  await getCustomers();
});

function getCustomers() {
  store.loading = true;
  loading.value = true;

  customersApi
    .getById(userId.value)
    .then((response) => {
      customerId.id = response.data.id;
      customerId.name = response.data.name;
      customerId.address = response.data.address;
      customerId.email = response.data.email;
      customerId.primaryPhone = response.data.primaryPhone;
      customerId.secondaryPhone = response.data.secondaryPhone;
      customerId.status = response.data.status;
      customerId.subsicrptions = response.data.subsicrptions;
      customerId.files = response.data.files;
      customerId.representative = response.data.representative;
      representativesLength.value = customerId.representative.length;
      console.log(customerId.representative);
      representativeId.value = customerId.representative;

      // getRepresentatives();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      store.loading = false;
      loading.value = false;
    });
}

const representativesLength = ref();

// needs an update with getbyId
// function getRepresentatives() {
//   representativesApi.get().then((response) => {
//     representativeId.value = response.data.content.filter(
//       (users: { customerName: string }) => users.customerName == customerId.name
//     );
//     console.log( representativeId.value)

//     representatives.value = response.data.content;
//     reprefileType1.value = response.data.content[0]?.files[0].docType;
//     reprefileType2.value = response.data.content[1]?.files[1].docType;

//     representativesLength.value = representativeId.value.length;
//   });
// }

// Define a method to get the text based on the number
const getIdentityTypeText = (type: number) => {
  switch (type) {
    case 1:
      return "اثبات هويه";
    case 2:
      return "جواز سفر";
    // Add more cases for other identity types
    default:
      return "Unknown identity type";
  }
};
const getDocTypeText = (type: string) => {
  switch (type) {
    case "1":
      return "بطاقة شخصية";
    case "2":
      return "رخصة من الشركة";
    // Add more cases for other doc types
    default:
      return "Unknown doc type";
  }
};

const toast = useToast();

const downloadFile = async (id: any) => {
  try {
    const response = await representativesApi.getFile(id, {
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
      detail: "حدث خطأ أثناء تحميل ملف المخول",
      life: 3000,
    });
  }
};
</script>

<template>
  <InfoCustomer
    :customer="customerId"
    :key="customerId.id"
    @getCustomers="store.getCustomers"
  />

  <card class="shadow-2 p-3 mt-3 border-round-2xl">
    <template #content>
      <TabView class="tabview-custom" ref="tabview4">
        <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-user"></i>
            <span>المخولين</span>
          </template>

          <!-- المخولون الخاصون بالعميل -->
          <Representative
            @getRepresentatives="getCustomers()"
            :customerStatus="customerId.status"
            :representatives-length="representativesLength"
          />
          <div v-if="loading">
            <div class="grid p-fluid">
              <div v-for="n in 2" class="ml-3 mb-2">
                <span>
                  <Skeleton width="15rem" height="25rem"></Skeleton>
                </span>
              </div>
            </div>
          </div>

          <div v-else class="grid">
            <div
              class="col-12 sm:col-8 md:col-5 representative-card"
              v-for="representative in representativeId"
              :key="representative.id"
            >
              <Card
                class="representative-card-content"
                style="background-color: #ffffff; color: #333333"
              >
                <template #header>
                  <div class="flex">
                    <Button
                      @click="openDialog()"
                      v-tooltip="{ value: 'ملفات المخول' }"
                      icon="fa-regular fa-file-lines"
                      class="p-button-primary"
                      text
                    >
                    </Button>

                    <div class="ml-auto">
                      <div v-if="representative.status !== 5">
                        <EditRepresentatives
                          :name="representative"
                          :key="representative.id"
                          @get-representatives="getCustomers"
                        >
                        </EditRepresentatives>
                      </div>
                    </div>
                    <!-- Lock button centered -->
                    <div class="flex items-center justify-center">
                      <LockButton
                        typeLock="Representatives"
                        :id="representative.id"
                        :name="
                          representative.firstName +
                          ' ' +
                          representative.lastName
                        "
                        :status="representative.status"
                        @getdata="getCustomers"
                      />
                    </div>

                    <div class="">
                      <DeleteRepresentives
                        :name="representative"
                        :key="representative.id"
                        @getRepresentatives="getCustomers()"
                      />
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="min-h-450">
                    <div class="text-center font-bold text-lg">اسم المخول:</div>
                    <div class="text-center text-lg">
                      {{ representative.firstName }}
                      {{ representative.lastName }}
                    </div>
                    <div class="text-center font-bold mt-4 text-lg">
                      البريد الإلكتروني:
                    </div>
                    <div class="text-center text-lg">
                      {{ representative.email }}
                    </div>
                    <div class="flex justify-center mt-4">
                      <div class="flex-1">
                        <div class="text-center font-bold text-lg">
                          رقم الإثبات:
                        </div>
                        <div class="text-center text-lg">
                          {{ representative.identityNo }}
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="text-center font-bold mb-2 text-lg">
                          نوع الإثبات:
                        </div>
                        <div class="text-center text-lg">
                          {{ getIdentityTypeText(representative.identityType) }}
                        </div>
                      </div>
                    </div>
                    <div class="text-center mt-4">
                      <div class="font-bold mb-2 text-lg">رقم الهاتف:</div>
                      <div class="text-lg" style="direction: ltr">
                        {{ formattedPhoneNumber(representative.phoneNo) }}
                      </div>
                    </div>
                    <Dialog
                      header="ملفات المخول"
                      contentStyle="max-height: 80vh; max-width: 40vw; padding: 5px;"
                      v-model:visible="displayDialog"
                      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
                      :modal="true"
                    >
                      <div class="grid p-fluid mt-1 ml-1">
                        <div class="field col-12 md:col-6 lg:col-4">
                          <div class="grid p-fluid">
                            <div class="file-container">
                              <ul class="file-list">
                                <div class="file-item mb-4">
                                  <div class="file-input flex">
                                    <span class="p-float-label">
                                      <InputText
                                        style="width: auto"
                                        class="p-inputtext p-component"
                                        v-model="
                                          representative.files[0].fileName
                                        "
                                        :disabled="true"
                                      />

                                      <label for="secondaryPhone"
                                        >اسم الملف</label
                                      >
                                    </span>
                                    <span class="p-float-label">
                                      <InputText
                                        style="width: auto"
                                        class="p-inputtext p-component"
                                        v-model="
                                          representative.files[0].docType
                                        "
                                        :value="
                                          getDocTypeText(
                                            representative.files[0].docType
                                          )
                                        "
                                        :disabled="true"
                                      />
                                      <label for="secondaryPhone"
                                        >نوع الملف</label
                                      >
                                    </span>
                                    <div class="file-actions">
                                      <Button
                                        style="
                                          color: #007bff;
                                          font-size: small;
                                          font-weight: bold;
                                        "
                                        @click="
                                          downloadFile(
                                            representative.files[0].id
                                          )
                                        "
                                        icon="fa-solid fa-download"
                                        class="p-button-text p-button-info"
                                      >
                                        تحميل
                                      </Button>
                                      <Button
                                        style="
                                          color: #007bff;
                                          font-size: small;
                                          font-weight: bold;
                                        "
                                        icon="fa-solid fa-eye"
                                        class="p-button-text p-button-info"
                                      >
                                        عرض
                                      </Button>
                                    </div>
                                  </div>
                                  <div class="file-input flex mt-5">
                                    <span class="p-float-label">
                                      <InputText
                                        style="width: auto"
                                        class="p-inputtext p-component"
                                        v-model="
                                          representative.files[1].fileName
                                        "
                                        :disabled="true"
                                      />

                                      <label for="secondaryPhone"
                                        >اسم الملف</label
                                      >
                                    </span>
                                    <span class="p-float-label">
                                      <InputText
                                        style="width: auto"
                                        class="p-inputtext p-component"
                                        v-model="
                                          representative.files[1].docType
                                        "
                                        :value="
                                          getDocTypeText(
                                            representative.files[1].docType
                                          )
                                        "
                                        :disabled="true"
                                      />
                                      <label for="secondaryPhone"
                                        >نوع الملف</label
                                      >
                                    </span>
                                    <div class="file-actions">
                                      <Button
                                        style="
                                          color: #007bff;
                                          font-size: small;
                                          font-weight: bold;
                                        "
                                        @click="
                                          downloadFile(
                                            representative.files[1].id
                                          )
                                        "
                                        icon="fa-solid fa-download"
                                        class="p-button-text p-button-info"
                                      >
                                        تحميل
                                      </Button>
                                      <Button
                                        style="
                                          color: #007bff;
                                          font-size: small;
                                          font-weight: bold;
                                        "
                                        icon="fa-solid fa-eye"
                                        class="p-button-text p-button-info"
                                      >
                                        عرض
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Toast position="bottom-left" />

                    </Dialog>
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </TabPanel>
        <!-- <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-calendar"></i>
            <span>جدول الزيارات</span>
          </template>
           {{ customerId }} -->
        <!-- الزيارات الخاصة بالعميل -->
        <!-- </TabPanel>  -->
        <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-cog"></i>
            <span>جدول الاشتراكات</span>
          </template>
          <SubscriptionByCustomerId
            :key="customerId.subsicrptions"
            :subsId="customerId.subsicrptions"
          />
        </TabPanel>
      </TabView>
    </template>
  </card>
</template>

<style scoped>
.p-card >>> .p-card-body {
  padding: 0rem 0;
}

/* Add this style to your component's <style> section */
.representative-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  padding: 1px; /* Adjust the padding value */
  overflow: hidden;
  border: 2px solid transparent; /* Add a border */
}

.representative-card-content {
  padding: 16px;
}

.representative-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(9, 9, 198, 0.2); /* Blueish shadow */
}
.file-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
