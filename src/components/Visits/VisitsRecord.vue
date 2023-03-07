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
       
        <Card>
            <template #title>
                سجل الزيارات
            </template>
            <template #content>
            <DataTable  ref="dt" :value="users" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} سجل الزيارات" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row justiify-content-between">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                            <label for="phoneNum1"> البحث </label>

                        </span>
					</div>
                    
                </template>
                <Column field="code" header="الإسم "  style="min-width:12rem;  "></Column>
                <Column field="name" header="  الحاله "  style="min-width:12rem"></Column>
                <Column field="name" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                <Column field="name" header=" العنوان"  style="min-width:12rem"></Column>
                <Column field="name" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                <Column field="name" header="  رقم الهاتف 2"  style="min-width:12rem"></Column>


</DataTable>
</template>
</Card>

    </div>
</template>

<style>



</style>