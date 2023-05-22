<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { computed, onMounted, reactive, ref } from 'vue';
import {  useRoute } from 'vue-router';
import { user } from '../../api/user';
import { toNumber } from '@vue/shared';
import type { RequestUserModel } from '../../Modules/UserModule/UserModuleRequest';
import { useUserStor } from "../../stores/user"
import InfoUser from './InfoUser.vue';

const route = useRoute()

const store=useUserStor();

const userId = computed(() => {
    if (route && route.params && route.params.id) {
        return toNumber(route.params.id)
    } else {
        return null // or return a default value if id is not available
    }
})

console.log(userId.value)

const userDate:RequestUserModel = reactive({
    id:null,
    fullName :'',
    empId : null,
    permisssions: null,
    status:null,
    password:''
});


onMounted(async () => {
    user
    .getById(userId.value)
        .then(function (response) {
            console.log(response.data)
            userDate.id = response.data.id;
            userDate.empId = response.data.empId;
            userDate.fullName = response.data.fullName
            userDate.password = response.data.password
            userDate.status = response.data.status
            userDate.permisssions = response.data.permisssions
        })
        .catch(function (error) {
            console.log(error)
        })
})
console.log(userDate)


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
    <InfoUser :user="userDate" :key="userId" @getUser="store.getUser" />
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