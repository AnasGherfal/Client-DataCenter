<script lang="ts" setup>
import { computed, reactive } from 'vue';
import AddNewHours from './AddNewHoursView.vue';
import PakagesList from '@/components/Pakages/PakagesList.vue'
import VisitHours from './VisitHoursView.vue'
import Addpackages from '@/components/Pakages/Addpackages.vue';
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

                            <Addpackages/>
                            <PakagesList />

                        </div>

                    </TabPanel>

                </TabView>
            </template>

        </Card>
    </div>
</template>

<style ></style>

