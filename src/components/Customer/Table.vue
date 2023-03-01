<script setup lang="ts">
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';


const users = ref(['fdf','dff']);
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
    <div>
       
        <Card style="width: 100%; margin-top: 2rem; margin-right: 20%; border-radius: 10px;">
            <template #title>
                سجل العملاء
            </template>
            <template #content>
            <DataTable  ref="dt" :value="users" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row justiify-content-between">
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
					</div>
                    
                </template>
                <Column field="code" header="الإسم " :sortable="true" style="min-width:12rem;  "></Column>
                <Column field="name" header="  الحاله " :sortable="true" style="min-width:12rem"></Column>
                <Column field="name" header="البريد الالكتروني" :sortable="true" style="min-width:12rem"></Column>
                <Column field="name" header=" العنوان" :sortable="true" style="min-width:12rem"></Column>
                <Column field="name" header="  رقم الهاتف 1" :sortable="true" style="min-width:12rem"></Column>
                <Column field="name" header="  رقم الهاتف 2" :sortable="true" style="min-width:12rem"></Column>


</DataTable>
</template>
</Card>

    </div>
</template>