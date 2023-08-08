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
import SubscriptionRecordById from "@/views/subscriptions/SubscriptionRecordById.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import { representativesApi } from "@/api/representatives";
import type { Customer } from "@/Modules/CustomerModule/CustomersModule";
import { formattedPhoneNumber } from "@/tools/phoneUtils";

const route = useRoute();
const store = useCustomersStore();
const loading = ref(false);

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
});

const representativeId = ref();
const representatives = ref();

onMounted(async () => {
  store.loading = true;
  loading.value = true;

  customersApi
    .getById(userId.value)
    .then((response) => {
      console.log(response.data.subsicrptions);
      customerId.id = response.data.id;
      customerId.name = response.data.name;
      customerId.address = response.data.address;
      customerId.email = response.data.email;
      customerId.primaryPhone = response.data.primaryPhone;
      customerId.secondaryPhone = response.data.secondaryPhone;
      customerId.status = response.data.status;
      customerId.subsicrptions = response.data.subsicrptions;
      customerId.files = response.data.files;

      getRepresentatives();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      store.loading = false;
      loading.value = false;
    });
});

const representativesLength = ref();

// needs an update with getbyId
function getRepresentatives() {
  representativesApi.get().then((response) => {
    representativeId.value = response.data.content.filter(
      (users: { customerName: string }) => users.customerName == customerId.name
    );

    representatives.value = response.data.content;
    representativesLength.value = representativeId.value.length;
  });
}

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
            @getRepresentatives="getRepresentatives()"
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
              class="col-12 sm:col-6 md:col-4 representative-card"
              v-for="representative in representativeId"
              :key="representative.id"
            >
              <Card
                class="representative-card-content"
                style="background-color: #ffffff; color: #333333"
              >
                <template #header>
                  <div class="flex">
                    <!-- Delete button on the left -->
                    <div class="ml-auto">
                      <div v-if="representative.status !== 5">
                        <EditRepresentatives
                          :name="representative"
                          :key="representative.id"
                          @get-representatives="getRepresentatives"
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
                        @getdata="getRepresentatives()"
                      />
                    </div>

                    <div class="">
                      <DeleteRepresentives
                        :name="representative"
                        :key="representative.id"
                        @getRepresentatives="getRepresentatives()"
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
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-calendar"></i>
            <span>جدول الزيارات</span>
          </template>
          <!-- الزيارات الخاصة بالعميل -->
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-cog"></i>
            <span>جدول الاشتراكات</span> </template
          >{{ customerId.subsicrptions }}
          <SubscriptionRecordById
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
</style>
