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
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row justiify-content-between">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                            <label for="phoneNum1"> البحث </label>
                            <Button @click="">

                            </Button>


                        </span>
					</div>
                    
                </template>
                <Column field="name" header="الإسم "  style="min-width:12rem;  "></Column>
                <Column field="status" header="  الحاله "  style="min-width:12rem"></Column>
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