<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useCustomersStore } from '@/stores/customers'
import axios from 'axios';
import Row from 'primevue/row';
import AddBotton from '@/components/AddBotton.vue';
// optional

const store = useCustomersStore();
const sublist=ref();

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([

    { field: 'startDate', header: 'تاريخ بداية الاشتراك' },
    { field: 'endDate', header: 'تاريخ انتهاء الاشتراك' },
    { field: 'serviceName', header: 'الباقه' }

]);
const selectedColumns = ref(columns.value);
const loading = ref(true);

const onToggle = (val: any) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};



const statuses = ref(['نشط', 'غير نشط', 'من',]);



 onMounted( async () =>{
    await  axios.get("https://localhost:7003/api/Subscription?pagenum=1&pagesize=25")
  .then(function (response) {
    sublist.value = response.data.content

    console.log(sublist)
  })
  .catch(function (error) {
    console.log(error)
  })

    })

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


                <DataTable ref="dt" :value="sublist" dataKey="id" :paginator="true" :rows="5" v-model:filters="filters"
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
                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                        :key="col.field + '_' + index" style="min-width:10rem;  "></Column>





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