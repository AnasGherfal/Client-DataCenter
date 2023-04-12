<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import Row from 'primevue/row';
import AddBotton from '@/components/AddBotton.vue';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import moment from 'moment';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import type { SubscriptionRespons } from './SubscriptionsRespons';

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
    return "الخدمة مفعلة"
}else if(value===2){
    return "الخدمة غير مفعلة" 
}
};

const saw = new Date()
console.log(saw)
const customersDialog=ref(false)
let rotName:SubscriptionRespons=reactive({
    id:null,
    status:null,
    serviceName:'' ,
    customerName: '' ,
    startDate:'',
    endDate:'',
    subscriptionFileId:null 
})

function getId(index:SubscriptionRespons) {
    rotName = index;
    console.log(rotName.endDate.valueOf()-rotName.startDate.valueOf())

    console.log(rotName.id)
    customersDialog.value = true
}

const renewalSubscription= () => {
    console.log(rotName)
    axios.put('https://localhost:7003/api/Subscription?id=' + rotName.id)
        .then(response => {
            console.log(response)
            toast.add({ severity: 'success', summary: 'تم التجديد', detail: response.data.msg, life: 3000 });
            customersDialog.value = false
        });
        }
   

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
                    <Column field="customerName" header="اسم العميل" style="min-width:10rem;" class="font-bold"></Column>

                    <Column field="status" header="الحالة"  dataType="date" style="min-width:10rem;" >
                            <template #body="{ data }">
                                {{ status(data.status) }}
                            </template>
                    </Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                        :key="col.field + '_' + index" style="min-width:10rem;  "></Column>
                        

                        <Column field="startDate" header="تاريخ بداية الاشتراك"  dataType="date" style="min-width:10rem;" >
                            <template #body="{ data }">
                             {{ formatDate(data.startDate) }}
                          </template>
                        </Column>

                        <Column field="endDate" header="تاريخ نهاية الاشتراك"  dataType="date" style="min-width:10rem;" >
                            <template #body="{ data }">
                             {{ formatDate(data.endDate) }}
                          </template>
                        </Column>

                        <Column style="min-width:8rem">
                        <template #body="slotProps">

                  <RouterLink :key="slotProps.data.id"  :to="'/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id" style="text-decoration: none">
                   <Button icon="fa-solid fa-circle-info" severity="info" text rounded 
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"  />
                  </RouterLink>
                  <Button icon="fa-solid fa-arrows-rotate" severity="warning" text rounded aria-label="Cancel"  @click="getId(slotProps.data)" />
                  <Dialog v-model:visible="customersDialog" :style="{ width: '450px' }" header="تجديد الاشتراك"
                                    :modal="true">

                                    <div class="confirmation-content">
                                        <i class="fa-solid fa-arrows-rotate mr-3" style="font-size: 2rem; color: green;" />
                                        <span >هل انت متأكد من تجديد الاشتراك؟</span>
                                    </div>
                                    <template #footer>
                                        <Button label="لا" icon="pi pi-times" text @click="customersDialog = false" />
                                        <Button label="نعم" icon="pi pi-check" text @click="renewalSubscription" />
                                    </template>


                                </Dialog>      
                   </template>
                   </Column>



                </DataTable>
            </template>
        </Card>

    </div>
</template>

<style>
/* .p-datatable .p-datatable-tbody>tr>td {
    text-align: right;
    border: 1px solid #e9ecef;
    border-width: 0 0 1px 0;
    padding: 1rem 1rem;
} */
</style>