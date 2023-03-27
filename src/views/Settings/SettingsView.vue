<script lang="ts" setup>
import { computed, reactive } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import ServicesList from '../Services/ServicesList.vue'
import VisitHours from './VisitHoursView.vue';
import AddService from '../Services/AddService.vue'
const state = reactive({

})

</script>

<template>
    <div>
        <Card>
            <template #title> اعدادات النظام</template>
            <template #content>
                <TabView ref="tabview" class="tabview-custom">
                    <TabPanel>
                        <template #header>
                            <i class="fa-solid fa-clock ml-2"></i>
                            <span>ساعات الزيارات والاسعار</span>
                        </template>
                        <VisitHours/>
                        
                    </TabPanel>
                    <TabPanel>
                        <template #header>
                            <i class="fa-solid fa-gauge ml-2"></i>
                            <span>الباقات</span>

                        </template>

                        <div>

                            <AddService />
                            <ServicesList />

                        </div>

                    </TabPanel>

                </TabView>
            </template>

        </Card>
    </div>
</template>

<style ></style>

