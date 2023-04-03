<script setup lang="ts">
import {  ref, reactive, onMounted, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import {useCustomersStore} from '@/stores/customers'
import router from '@/router';
import axios from 'axios';
import { email, minLength, required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
const toast = useToast();


const componentKey = ref(0);
const store = useCustomersStore();
const deleteCustomersDialog = ref(false)

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
// const rot=ref()





// function goInfoPage(user: {}) {
//     rotName.value = user;
//     console.log(rotName.value.id)

//     axios.delete('https://localhost:7003/api/Customers/'+ rotName.value.id )
//       .then(response => {
//        console.log(response)
//        console.log(response.data.msg)
//        toast.add({ severity: 'success', summary: 'Success Message', detail: response.data.msg, life: 3000 });

       
//       });
       
 

//     // router.go("customersRecord/CustomerProfile")
// }

const forceRerender = () => {
  componentKey.value += 1;
}

//Delet Customer

function getid(index: {}) {
    rotName.value = index;
    console.log(rotName.value.name)
    deleteCustomersDialog.value=true
}

const deleteCustomer = () => {
console.log(rotName.value)
axios.delete('https://localhost:7003/api/Customers/'+rotName.value.id )
.then(response => {
 console.log(response)
 store.getdata();
 toast.add({ severity: 'success', summary: 'Confirmed', detail: response.data.msg, life: 3000 });
 deleteCustomersDialog.value = false

});

}


</script>

<template>
    <RouterView></RouterView>

    <div v-if="($route.path === '/customersRecord')">
        <Card>
    
            <template #title>
                سجل العملاء
                <RouterLink to="/customersRecord/addCustomers" style="text-decoration: none">
                        <Button icon="fa-solid fa-plus" v-tooltip="{value:'إضافة عميل', fitContent:true}" label="" rounded style="  float: left;" class="mr-2"> </Button>
                    </RouterLink>
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

                    <div class=" field col-12 md:col-6 lg:col-4 ">

                    <div class="table-header flex flex-column md:flex-row justiify-content-between ">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="" />
                            <label for="phoneNum1"> البحث </label>
                        </span>
                    </div>
                    </div>

                    <div class=" field col-12 md:col-6 lg:col-4 " >
                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                        placeholder="حدد الأعمدة" />
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
             
            <Button icon="fa-solid fa-trash-can" severity="danger" text rounded aria-label="Cancel"  @click="getid(slotProps.data)" />

            <Dialog  v-model:visible="deleteCustomersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">

            <div  class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="rotName">هل انت متأكد من حدف <b>{{rotName.name}}</b> ؟</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCustomersDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="deleteCustomer" />
            </template>

        </Dialog>
        <toast/>

        </template>

        </Column>

</DataTable>
</div>
</template>
</Card>

    </div>

      
    
</template>

<style>

</style>