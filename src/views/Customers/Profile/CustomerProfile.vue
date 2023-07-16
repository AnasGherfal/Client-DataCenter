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
import SubscriptionRecord from "@/components/Subscriptions/subscriptionRecord.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import { representativesApi } from "@/api/representatives";
import type { Customer } from "@/Modules/CustomerModule/CustomersModule";

const route = useRoute();
const store = useCustomersStore();
const loading = ref(false);

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return Number(route.params.id); // Convert the ID to a number
  } else {
    return -1; // or return a default value if id is not available, such as -1
  }
});
const customerId: Customer = reactive({
  name: "",
  email: "",
  address: "",
  primaryPhone: "",
  secondaryPhone: "",
  files: [{ file: "", docType: 0 }],
});

const representativeId = ref();
const representatives = ref();

onMounted(async () => {
  store.loading = true;
  loading.value = true;

  customersApi
    .getById(userId.value)
    .then((response) => {
      console.log(response);
      customerId.id = response.data.id;
      customerId.name = response.data.name;
      customerId.address = response.data.address;
      customerId.email = response.data.email;
      customerId.primaryPhone = response.data.primaryPhone;
      customerId.secondaryPhone = response.data.secondaryPhone;
      customerId.status = response.data.status;

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
              class="col-12 md:col-6"
              v-for="representative in representativeId"
              :key="representative.id"
            >
              <Card
                class="w-3/5 mx-auto"
                style="background-color: #ffffff; color: #333333"
              >
                <template #header>
                  <DeleteRepresentives
                    :name="representative"
                    :key="representative.id"
                    @getRepresentatives="getRepresentatives()"
                  />

                  <LockButton
                    typeLock="Representives"
                    :id="representative.id"
                    :name="
                      representative.firstName + ' ' + representative.lastName
                    "
                    :status="representative.status"
                    @getdata="getRepresentatives()"
                  />

                  <div v-if="representative.status !== 5">
                    <EditRepresentatives
                      :name="representative"
                      :key="representative.id"
                      @get-representatives="getRepresentatives"
                    >
                    </EditRepresentatives>
                  </div>
                </template>
                <template #content>
                  <div class="min-h-450">
                    <div class="text-center font-bold text-lg mb-2">
                      اسم المخول:
                    </div>
                    <div class="text-center text-lg">
                      {{ representative.firstName }}
                      {{ representative.lastName }}
                    </div>
                    <div class="text-center font-bold mt-4 mb-2 text-lg">
                      البريد الإلكتروني:
                    </div>
                    <div class="text-center text-lg">
                      {{ representative.email }}
                    </div>
                    <div class="flex justify-center mt-4">
                      <div class="flex-1">
                        <div class="text-center font-bold mb-2 text-lg">
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
                        {{ representative.phoneNo }}
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
            <span>جدول الاشتراكات</span>
          </template>
          <SubscriptionRecord :key="customerId.id" :customerId="customerId" />
          <!-- الخدمات الخاصة بالعميل -->
        </TabPanel>
      </TabView>
    </template>
  </card>
</template>

<style></style>
