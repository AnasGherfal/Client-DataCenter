<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import {useCustomersStore} from '@/stores/customers'
import axios from 'axios';
import Row from 'primevue/row'; 
                  // optional

const store = useCustomersStore();


const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
            {field: 'status', header: 'الحاله'},
            {field: 'email', header: 'البريد الإكتروني'},

            {field: 'address', header: 'العنوان'},
            {field: 'phoneNumber1', header: 'رقم الهاتف (1)'},
            {field: 'phoneNumber2', header: 'رقم الهاتف (2)'}

        ]);
        const selectedColumns = ref(columns.value);
        const loading = ref(true);

        const onToggle = (val:any) => {
            selectedColumns.value = columns.value.filter(col => val.includes(col));
        };

        const filterss = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

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

const getSeverity = (status:any) => {
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

    <div v-if="$route.path !== '/subscriptionsRecord/addSubsciptions'">
        <Card>
    
            <template #title>

                سجل العملاء
            </template>
            <template #content >
           
                
            <DataTable  ref="dt" :value="store.users" dataKey="id" 
                :paginator="true" :rows="5" v-model:filters="filters" 
                :globalFilterFields="['name', 'status']"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                <template #header>
                    <div class="grid ">
                    <div class="table-header flex flex-column md:flex-row justiify-content-between ">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="" />
                            <label for="phoneNum1"> البحث </label>

                        </span>

                
                <!-- <RouterLink :to="$route.params.id + '/users'"> -->
                    <RouterLink to="/subscriptionsRecord/addSubsciptions" style="text-decoration: none">
                <Button icon="fa-solid fa-plus" label="إضافة اشتراك"  class="mr-2"> </Button>
            </RouterLink>
					</div>
                    </div>
                   
                </template>
                <Column field="name" header="الإسم"  style="min-width:10rem;"  class="font-bold"></Column>
                <!-- <Column  v-for="(col,index) of selectedColumns" :field="col.field"  :header="col.header" :key="col.field + '_' + index" style="min-width:10rem;  "
                ></Column> -->
                
                <Column field="status" header="  الحاله " filterField="status" style="min-width:12rem" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }">
                    <template #body="{ data }">
                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" class="p-column-filter" style="min-width: 12rem" :showClear="true">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Dropdown>
                </template>
                
                </Column>
                <Column field="email" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                <Column field="address" header=" العنوان"  style="min-width:12rem"></Column>
                <Column field="phoneNumber1" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="phoneNumber2" header="  رقم الهاتف 2"  style="min-width:12rem"></Column>


</DataTable>
</template>
</Card>

    </div>
    
</template>

<style>



.p-datatable .p-datatable-tbody > tr > td {
    text-align: right;
    border: 1px solid #e9ecef;
    border-width: 0 0 1px 0;
    padding: 1rem 1rem;
}
</style>