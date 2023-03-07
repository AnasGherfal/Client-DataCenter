<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import {useUsersStore} from '@/stores/users'
import axios from 'axios';

const store = useUsersStore();
let users = ref([{}]);


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

        const onToggle = (val:any) => {
            selectedColumns.value = columns.value.filter(col => val.includes(col));
        };

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
</script>

<template>
    <div >

        <Card>
    
            <template #title>
                سجل العملاء
            </template>
            <template #content >
           
                
            <DataTable  ref="dt" :value="store.users" dataKey="id" 
                :paginator="true" :rows="5" :filters="filters"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row justiify-content-between">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="مثال: اشرف" />
                            <label for="phoneNum1"> البحث </label>

                        </span>

                        <div style="text-align:left; padding: right: 5rem;;">

                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                        placeholder="حدد الأعمدة" style="width: 10em"/>
                </div>
					</div>
                    
                </template>
                <Column field="name" header="الإسم "  style="min-width:10rem;  "></Column>
                <Column  v-for="(col,index) of selectedColumns" :field="col.field"  :header="col.header" :key="col.field + '_' + index" style="min-width:10rem;  "
                ></Column>
                <!-- <Column field="status" header="  الحاله "  style="min-width:12rem"></Column>
                <Column field="email" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                <Column field="address" header=" العنوان"  style="min-width:12rem"></Column>
                <Column field="phoneNumber1" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="phoneNumber2" header="  رقم الهاتف 2"  style="min-width:12rem"></Column> -->


</DataTable>
</template>
</Card>

    </div>
</template>

<style>

.p-paginator-next	{
transform: rotate(180deg) !important;


}

.p-paginator-prev	{
    transform: rotate(180deg) !important;
}

.p-datatable .p-datatable-tbody > tr > td {
    text-align: right;
    border: 1px solid #e9ecef;
    border-width: 0 0 1px 0;
    padding: 1rem 1rem;
}
</style>