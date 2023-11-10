<script setup lang="ts">
import InfoCustomer from "./CustomerDetails.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { computed, onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import Representative from "./Representatives/Representatives.vue";
import DeleteRepresentives from "./Representatives/DeleteRepresentatives.vue";
import EditRepresentatives from "./Representatives/EditRepresentatives.vue";
import { useCustomersStore } from "@/stores/customers";
import SubscriptionByCustomerId from "@/views/subscriptions/SubscriptionByCustomerId.vue";
import LockButton from "@/components/LockButton.vue";
import { customersApi } from "@/api/customers";
import { representativesApi } from "@/api/representatives";
import { formattedPhoneNumber } from "@/tools/phoneUtils";
import { useToast } from "primevue/usetoast";
import { RepresentativeModel } from "../../../Modules/Representatives/RepresentativesModel";
import { subscriptionApi } from "../../../api/subscriptions";
import { SubscriptionRespons } from "../../../Modules/SubscriptionModule/SubscriptionsResponseModule";

const route = useRoute();
const store = useCustomersStore();
const loading = ref(false);

const displayDialog = ref(false);

const userId = computed(() => {
  if (route && route.params && route.params.id) {
    return String(route.params.id); // Convert the ID to a number
  } else {
    return ""; // or return a default value if id is not available, such as -1
  }
});
const customer = reactive({
  id: "",
  address: "",
  city: "",
  status:0,
  name: "",
  email: "",
  primaryPhone: "",
  secondaryPhone: "",
  files: [
    { file: null, docType: 0 },
    { file: null, docType: 0 },
  ],
  subsicrptions: "",
  createdOn: "",
  representative: [] as RepresentativeModel[],
  subscriptions: [] as SubscriptionRespons[],
});

const openDialog = () => {
  displayDialog.value = true;
};

onMounted(async () => {
  await getCustomers();
});

function getCustomers() {
  loading.value = true;

  customersApi
    .getById(userId.value)
    .then((response) => {
      const content = response.data.content;
      customer.id = content.id;
      customer.address = content.address;
      customer.city = content.city;
      customer.createdOn = content.createdOn;
      customer.status = content.status;
      customer.email = content.email;
      customer.files = content.files;
      customer.name = content.name;
      customer.primaryPhone = content.primaryPhone;
      customer.secondaryPhone = content.secondaryPhone;
      getRepresentatives();
      getSubscriptions();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

// needs an update with getbyId
function getRepresentatives() {
  representativesApi.get(userId.value).then((response) => {
    customer.representative = response.data.content;
  });
}
function getSubscriptions() {
  subscriptionApi.get(1, 20, userId.value).then((response) => {
    customer.subsicrptions = response.data.content;
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

const downloadFile = async (fileId: any) => {
  try {
    const response = await representativesApi.getFile(customer.id, fileId);

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
    :customer="customer"
    :key="customer.id"
    @getCustomers="getCustomers"
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
            :customerStatus="customer.status"
            :CustomerId="customer.id"
            :representatives="customer.representative"
          />
        </TabPanel>
        <!-- <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-calendar"></i>
            <span>جدول الزيارات</span>
          </template>
           {{ customer }} -->
        <!-- الزيارات الخاصة بالعميل -->
        <!-- </TabPanel>  -->
        <TabPanel>
          <template #header>
            <i class="ml-2 pi pi-cog"></i>
            <span>جدول الاشتراكات</span>
          </template>
          <SubscriptionByCustomerId
            :key="customer.subsicrptions"
            :subsId="customer.subsicrptions"
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
