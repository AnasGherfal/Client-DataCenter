<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import AddNewHours from './TimeShift/AddTimeShiftsView.vue';
import ServicesList from './Services/ServicesList.vue'
import VisitHours from './TimeShift/TimeShiftsView.vue';
import AddService from './Services/AddService.vue'
import { useAuthStore } from '@/stores/auth';
import { useSharedStore} from '@/stores/shared';
import { admin } from '@/api/admin';

const authStore =useAuthStore()
const sharedStore = useSharedStore()
const state = reactive({

})
interface UserPermission {
  id: number;
  name: string;
}

const hide = ref(false)
const permissionsList = ref<UserPermission[]>([]);

function getPermissions() {
  admin.permissions().then(function (response) {
    permissionsList.value = response.data.content;
  });
}





</script>

<template>
    <div>
        <Card>
            <template #title> اعدادات النظام</template>
            <template #content>
                <TabView ref="tabview" class="tabview-custom"             
                       >



                       <div v-if="sharedStore.hasPermission([128], authStore.prem)">
                       <TabPanel >
                           <template #header>
                            <i class="fa-solid fa-clock ml-2"></i>
                            <span>ساعات الزيارات والاسعار</span>
                        </template>
                        <VisitHours/>
                        
                    </TabPanel>
                    
                </div>
                <div v-if="sharedStore.hasPermission([4], authStore.prem)">

                    <TabPanel>
                        <template #header>
                            <i class="fa-solid fa-gauge ml-2"></i>
                            <span>الباقات</span>

                        </template>

                        <div>

                            <ServicesList />

                        </div>

                    </TabPanel>
                    </div>

                </TabView>
            </template>

        </Card>
    </div>
</template>


