<script lang="ts" setup>
import { computed, reactive } from 'vue';
const state = reactive({

})

</script>

<template>
    <div>
        <Card>
            <template #title> سجل الفواتير</template>
            <template #content>
                <TabView ref="tabview" class="tabview-custom">
                    <TabPanel>
                        <template #header>
                            <i class="fa-solid fa-clock ml-2"></i>
                            <span> الفواتير المدفوعه</span>
                        </template>
                        <VisitHours/>
                        
                    </TabPanel>
                    <TabPanel>
                        <template #header>
                            <i class="fa-solid fa-gauge ml-2"></i>
                            <span>الفواتير الغير مدفوعه</span>

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