<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useCustomersStore } from '@/stores/customers'
import axios from 'axios';
import Row from 'primevue/row';
// optional

const store = useCustomersStore();


const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([

    { field: 'address', header: 'تاريخ بداية الاشتراك' },
    { field: 'phoneNumber1', header: 'تاريخ انتهاء الاشتراك' },
    { field: 'phoneNumber2', header: 'الباقه' }

]);
const selectedColumns = ref(columns.value);
const loading = ref(true);

const onToggle = (val: any) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};



const statuses = ref(['نشط', 'غير نشط', 'من',]);



//  onMounted( () =>{
//          axios.get("http://localhost:3000/users")
//         .then(function(response) {
//             users.value = response.data;
//         console.log(users)
//     })
//     .catch(function(error){
//         console.log(error)
//       })

//     })

const getSeverity = (status: any) => {
    switch (status) {
        case 'نشط':
            return 'success';

        case 'غير نشط':
            return 'danger';

    }
}



</script>

<template>
    <RouterView></RouterView>

    <div v-if="$route.path === '/subscriptionsRecord'">
        <Card>

            <template #title>

                سجل الاشتراكات

                <RouterLink to="/subscriptionsRecord/addSubsciptions" style="text-decoration: none">
                                    <Button icon="fa-solid fa-plus" v-tooltip="{value:'إضافة اشتراك', fitContent:true}" label="" style="float: left;" rounded> </Button>
                                </RouterLink>
            </template>
            <template #content>


                <DataTable ref="dt" :value="store.users" dataKey="id" :paginator="true" :rows="5" v-model:filters="filters"
                    :globalFilterFields="['name', 'status']"
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

                            <div class=" field col-12 md:col-6 lg:col-4 ">
                                <RouterLink to="/subscriptionsRecord/addSubsciptions" style="text-decoration: none">
                                    <Button icon="fa-solid fa-plus" label="إضافة اشتراك"> </Button>
                                </RouterLink>
                                </div>
                        </div>

                    </template>
                    <Column field="name" header="الإسم" style="min-width:10rem;" class="font-bold"></Column>
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