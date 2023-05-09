<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { computed, inject, onMounted, onUnmounted, reactive, ref } from 'vue';
import router from '@/router';
import { RouterLink, routerKey, useRoute } from 'vue-router';
import axios from "axios"
import InfoCustomer from '../Customers/Profile/InfoCustomer.vue';
import InfoUser from './InfoUser.vue';

const route = useRoute()
const loading = ref(false);
const userId = computed(() => {
    if (route && route.params && route.params.id) {
        return route.params.id
    } else {
        return null // or return a default value if id is not available
    }
})
const customerId = ref({
    id: '',
    name: '',
});
const customerStatus = ref({

})
const representativeId = ref()
const representatives = ref();

onMounted(async () => {
    await axios.get("https://localhost:7003/api/Customers/")
        .then(function (response) {


            customerId.value = response.data.content.filter((users: { id: String }) => users.id == userId.value)[0];
             

            getRepresentatives();

        })
        .catch(function (error) {
            console.log(error)
        })
})

function getRepresentatives() {
    loading.value=true

    axios.get("https://localhost:7003/api/Representives/").then((response) => {
        representativeId.value = response.data.content.filter((users: { customerName: string }) => users.customerName == customerId.value.name);
        representatives.value = response.data.content
        loading.value=false

    });
}

// Define a method to get the text based on the number
const getIdentityTypeText = (type: number) => {
    switch (type) {
        case 1:
            return 'اثبات هويه';
        case 2:
            return 'جواز سفر';
        // Add more cases for other identity types
        default:
            return 'Unknown identity type';
    }
};



</script>

<template>
    <InfoUser />
    <Card>
        <template #content>
        <TabPanel>
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
        </template>
    </card>
</template>

<style></style>