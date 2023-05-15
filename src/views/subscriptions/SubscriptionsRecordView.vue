<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import AddBotton from '@/components/AddBotton.vue';
import LockButton from '@/components/LockButton.vue';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import moment from 'moment';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

// optional

const toast = useToast();
const store = useSubscriptionsStore();
const sublist=ref();

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([

    { field: 'serviceName', header: 'الباقه' }

]);
const selectedColumns = ref(columns.value);
const loading = ref(true);

const onToggle = (val: any) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};


const rotame=ref()
function getid(index: {}) {
    rotame.value = index;
    console.log(rotame.value.id)
}

const formatDate = (value:Date) => {
    return moment(value).format('yy/M/D  hh:mm a' );
};

const status = (value:number) => {
if(value===1){
    return "الاشتراك مفعل"
}else if(value===2){ 
    return "الاشتراك غير مفعل" 
}else if(value===5)
return "الاشتراك مقفل"
};

console.log(store.loading)


</script>

<template>
    <RouterView></RouterView>

    <div v-if="$route.path === '/subscriptionsRecord'">
        <Card>

            <template #title>

                سجل الاشتراكات
                <AddBotton name-button="إضافة اشتراك" rout-name="/subscriptionsRecord/addSubsciptions" />
            </template>
            <template #content>


                <DataTable ref="dt" :value="store.subscriptions" dataKey="id" :paginator="true" :rows="5" v-model:filters="filters"
                    :globalFilterFields="['serviceName', 'customerName']"
                    paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                    <template #header>
                        <div class="grid p-fluid">

                            <div class=" field col-12 md:col-6 lg:col-4 ">
                                <span class="p-input-icon-left p-float-label ">
                                    <i class="fa-solid fa-magnifying-glass" />
                                    <InputText v-model="filters['global'].value" placeholder="" />
                                    <label for="phoneNum1"> البحث </label>
                                </span>
                            </div>


                        </div>

                    </template>
                    <Column field="id" header="ID" style="min-width:1rem;" class="font-bold"></Column>

                    <Column field="customerName" header="اسم العميل" style="min-width:8rem;" class="font-bold"></Column>
                        <Column field="status" header="  الحاله " filterField="status" style="width:12rem"
                            :showFilterMenu="false" :filterMenuStyle="{ width: '12rem' }">
                            <template #body="{ data }">
                                <Tag :value="status(data.status)" :severity="(data.status)" />
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="['warning','']"
                                    placeholder="Select One" class="p-column-filter" style="min-width: 12rem"
                                    :showClear="true">
                                    <template #option="slotProps">
                                        <Tag :value="slotProps.option" :severity="(slotProps.option)" />
                                    </template>
                                </Dropdown>
                            </template>

                        </Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                        :key="col.field + '_' + index" style="min-width:3rem;">
                    </Column>
                        

                        <Column field="startDate" header="تاريخ بداية الاشتراك"  dataType="date" style="min-width:12rem;" >

                               <template  #body="{ data }">
                             {{ formatDate(data.startDate) }}
                          </template>
                        </Column>

                        <Column field="endDate" header="تاريخ نهاية الاشتراك"  dataType="date" style="min-width:12rem;" >

                            <template #body="{ data }">
                             {{ formatDate(data.endDate) }}
                          </template>
                        </Column>

                        <Column style="min-width:8rem">

                        <template  #body="slotProps">
                            <LockButton typeLock="Subscription" :id="slotProps.data.id" :name="slotProps.data.id"
                                    :status="slotProps.data.status" @getdata="store.getSub" />

                  <RouterLink :key="slotProps.data.id"  :to="'/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id" style="text-decoration: none">
                    

                   <Button icon="fa-solid fa-circle-info" severity="info" text rounded 
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"  />
                  
                  </RouterLink>
 
                   </template>
                   </Column>



                </DataTable>
            </template>
        </Card>

    </div>
</template>

<style>

</style>