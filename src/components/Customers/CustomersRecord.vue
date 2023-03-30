<script setup lang="ts">
import {  ref, reactive, onMounted, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import {useCustomersStore} from '@/stores/customers'
import router from '@/router';
import axios from 'axios';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from 'primevue/usetoast';
                  // optional

const store = useCustomersStore();
const componentKey = ref(0);


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const columns = ref([
            // {field: 'status', header: 'الحاله'},
            {field: 'email', header: 'البريد الإكتروني'},

            {field: 'address', header: 'العنوان'},
            {field: 'primaryPhone', header: 'رقم الهاتف (1)'},
            {field: 'secondaryPhone', header: 'رقم الهاتف (2)'}

        ]);
        const selectedColumns = ref(columns.value);

        const onToggle = (val:any) => {
            selectedColumns.value = columns.value.filter(col => val.includes(col));
        };



const statuses = ref(['نشط', 'غير نشط', 'منتهي الصلاحيه']);
const loading = ref(false);

onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 2000); // Set the timeout to the amount of time you want the loading page to display
    });

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

    // router.go("customersRecord/CustomerProfile")
}

const forceRerender = () => {
  componentKey.value += 1;
};

</script>

<template>
    <RouterView></RouterView>

    <div v-if=" ($route.path === '/customersRecord')">
        <Card>
    
            <template #title>
                سجل العملاء
            </template>
            <template #content >

                <div v-if="loading">
                    <div class="border-round border-1 surface-border p-4 surface-card">
    <div class="flex mb-3">
        <div>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <Skeleton height=".5rem"></Skeleton>
        </div>
    </div>
    <Skeleton width="100%" height="150px"></Skeleton>
    <div class="flex justify-content-between mt-3">
        <Skeleton width="100%" height="2rem"></Skeleton>
    </div>
</div>


            </div>
    
                <div v-else >
            <DataTable  filterDisplay="row"  ref="dt" :value="store.customers" dataKey="id" 
                :paginator="true" :rows="5" v-model:filters="filters" :key="componentKey"
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
                
                <Column field="name" header="الإسم"  style="min-width:10rem;"  class="font-bold" frozen></Column>
                
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
                <Column field="primaryPhone" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="secondaryPhone" header="  رقم الهاتف 2"  style="min-width:12rem"></Column> -->
                <Column style="min-width:8rem">

                    <template #body="slotProps">

            <RouterLink :to="'customersRecord/CustomerProfile/'+slotProps.data.name">
            <Button icon="fa-solid fa-user" severity="info" text rounded aria-label="Cancel"/>
           </RouterLink>
            <Button icon="fa-solid fa-trash-can" severity="danger" text rounded aria-label="Cancel"  @click="goInfoPage(slotProps.data)" />
           </template>
        </Column>
</DataTable>
</div>
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