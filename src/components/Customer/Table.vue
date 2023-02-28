<script setup lang="ts">import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';


const users = ref();
const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
</script>

<template>

    <div>
        <Card style="width: 70%; margin-left: 2em; margin-top: 2rem; border-radius: 10px;">
            <template #title>سجل العملاء</template>
            <DataTable
            ref="dt" :value="users"  dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">

            </DataTable>
</Card>
    </div>
</template>