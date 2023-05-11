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
    <card class=" shadow-2 p-3 mt-3 border-round-2xl">
        <template #content>

            <TabView class="tabview-custom" ref="tabview4">
                <TabPanel>
                    <template #header>
                        <i class="fa-solid fa-key ml-2"></i>
                        <span>الصلاحيات</span>

                    </template>
                    <!-- المخولون الخاصون بالعميل -->
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

<style>
</style>