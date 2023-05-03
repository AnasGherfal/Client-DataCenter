<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import moment from 'moment';
import axios from 'axios';

// optional

const subDeta = ref();
const props = defineProps<{
    customerId:any
}>()

onMounted(async () => {
    await axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
      .then(function (response) {
        console.log(response)
        
        subDeta.value = response.data.content.filter((subscription:{customerName: String}) => subscription.customerName === props.customerId.name);
      })
      .catch(function (error) {
        console.log(error)
      })
    })

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([

    { field: 'serviceName', header: 'الباقه' }

]);

const selectedColumns = ref(columns.value);



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
</script>

<template>
                <DataTable ref="dt" :value="subDeta" dataKey="id" :paginator="true" :rows="5" v-model:filters="filters"
                    :globalFilterFields="['serviceName', 'customerName']"
                    paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">

                    <Column field="customerName" header="اسم العميل" style="min-width:10rem;" class="font-bold"></Column>

                    <Column field="status" header="الحالة"  dataType="date" style="min-width:10rem;" >
                            <template #body="{ data }">
                                {{ status(data.status) }}
                            </template>
                    </Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                        :key="col.field + '_' + index" style="min-width:5rem;  "></Column>
                        

                        <Column field="startDate" header="تاريخ بداية الاشتراك"  dataType="date" style="min-width:11rem;" >
                            <template #body="{ data }">
                             {{ formatDate(data.startDate) }}
                          </template>
                        </Column>

                        <Column field="endDate" header="تاريخ نهاية الاشتراك"  dataType="date" style="min-width:11rem;" >
                            <template #body="{ data }">
                             {{ formatDate(data.endDate) }}
                          </template>
                        </Column>

                        <Column style="min-width:3rem">
                        <template #body="slotProps">

                  <RouterLink :key="slotProps.data.id"  :to="'/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id" style="text-decoration: none">
                   <Button icon="fa-solid fa-circle-info" severity="info" text rounded 
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"  />
                  </RouterLink>
 
                   </template>
                   </Column>
                </DataTable>

</template>

<style>

</style>