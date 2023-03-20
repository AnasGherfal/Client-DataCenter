<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';

const state = reactive({

})
const invoices = ref()
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

});



</script>

<template>
    <div v-if="$route.path !== '/invoices/InvoicesInfo'">

        <Card>
            <template #title> سجل الفواتير</template>
            <template #content>
                   
                            


                        <DataTable  filterDisplay="row"  ref="dt" :value="invoices" dataKey="id" 
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
					</div>
                    </div>
                   
                </template>
                <Column field="name" header="الإسم"  style="min-width:10rem;"  class="font-bold"></Column>

                
                <Column field="status" header="   " filterField="status" style="min-width:8rem" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }">
 
                
                </Column>
 
                <!-- <Column field="email" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                <Column field="address" header=" العنوان"  style="min-width:12rem"></Column>
                <Column field="phoneNumber1" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="phoneNumber2" header="  رقم الهاتف 2"  style="min-width:12rem"></Column> -->
                <Column style="min-width:8rem">

                    <template #body="slotProps">

            <RouterLink to="/customersRecord/CustomerProfile">
            <Button icon="fa-solid fa-user" severity="info" text rounded aria-label="Cancel"  />
            </RouterLink>
            <Button icon="fa-solid fa-trash-can" severity="danger" text rounded aria-label="Cancel"   />
           </template>
        </Column>


    
</DataTable>

            </template>

        </Card>
    </div>
</template>

<style ></style>