<script setup lang="ts">
import {  ref, reactive, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import {useCustomersStore} from '@/stores/customers'
import axios from 'axios';
import router from '@/router';

                  // optional

const store = useCustomersStore();


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const columns = ref([
            // {field: 'status', header: 'الحاله'},
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



const statuses = ref(['نشط', 'غير نشط', 'منتهي الصلاحيه']);



const getSeverity = (status:any) => {
    switch (status) {
        case 'نشط':
            return 'success';

        case 'غير نشط':
            return 'danger';

    }
}

const rotName = ref()
const rot=ref()

function getid(index: {}) {
    rotName.value = index;
    console.log(rotName.value.name)
    rot.value = "/customersRecord/CustomerProfile/"+ rotName.value.name
    router.push("/customersRecord/CustomerProfile/"+ rotName.value.name  )
}


function goInfoPage(user: {}) {
    rotName.value = user;
    console.log(rotName.value.name)

    // router.push("customersRecord/CustomerProfile")
}
</script>

<template>
    
    <RouterView></RouterView>

    <div v-if=" ($route.path === '/customersRecord')">
        <Card>
    
            <template #title>
                سجل العملاء
            </template>
            <template #content >
           
                
            <DataTable  filterDisplay="row"  ref="dt" :value="store.users" dataKey="id" 
                :paginator="true" :rows="5" v-model:filters="filters" 
                :globalFilterFields="['name', 'status']"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                <template #header>
                    <div class="grid p-fluid">
                    <div class="table-header flex flex-column md:flex-row justiify-content-between ">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="" />
                            <label for="phoneNum1"> البحث </label>

                        </span>

                        <div style="text-align:left; margin-right: 0.5rem;">

                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                        placeholder="حدد الأعمدة" style="width: 10em"/>
                </div>
                
                    <RouterLink to="/customersRecord/addCustomers" style="text-decoration: none">
                <Button icon="fa-solid fa-plus" label="إضافة عميل" style="width: 150px;" class="mr-2"> </Button>
            </RouterLink>
					</div>
                    </div>
                   
                </template>
                <Column field="name" header="الإسم"  style="min-width:10rem;"  class="font-bold"></Column>

                
                <Column field="status" header="  الحاله " filterField="status" style="min-width:8rem" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }">
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
                <Column  v-for="(col,index) of selectedColumns" :field="col.field"  :header="col.header" :key="col.field + '_' + index" style="min-width:10rem;  "
                ></Column>
                <!-- <Column field="email" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                <Column field="address" header=" العنوان"  style="min-width:12rem"></Column>
                <Column field="phoneNumber1" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="phoneNumber2" header="  رقم الهاتف 2"  style="min-width:12rem"></Column> -->
                <Column style="min-width:8rem">

                    <template #body="slotProps">

            <RouterLink :to="'customersRecord/CustomerProfile/'+slotProps.data.name">
            <Button icon="fa-solid fa-user" severity="info" text rounded aria-label="Cancel"/>
           </RouterLink>
            <Button icon="fa-solid fa-trash-can" severity="danger" text rounded aria-label="Cancel"  @click="goInfoPage(slotProps.data)" />
           </template>
        </Column>


    
</DataTable>
</template>
</Card>

    </div>
    
</template>

<style>




 /* .pi-times:before {
     content: "\e90b";
     margin-right: 2rem;
 } */
</style>