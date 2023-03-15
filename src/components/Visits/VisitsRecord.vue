<script setup lang="ts">
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import router from '@/router';


const users = ref(['fdf','dff']);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function backButton() {
    router.push("/VisitsRecords")

}
</script>

<template>
        <RouterView></RouterView>

    <div v-if="$route.path !== '/visitsRecords/createVisit'">
       
        <Card>
            <template #title>
                سجل الزيارات
            </template>
            <template #content>
            <DataTable :value="users" dataKey="id"        filterDisplay="row"
           :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"

                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} سجل الزيارات" responsiveLayout="scroll">
                <template #header>
                    <div class="grid p-fluid">

                    <div class="table-header flex flex-column md:flex-row justiify-content-between">
						<span class="p-input-icon-left p-float-label ">
                            <i class="fa-solid fa-magnifying-glass" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                            <label for="phoneNum1"> البحث </label>

                        </span>

                        <RouterLink to="/visitsRecords/createVisit" style="text-decoration: none">
                <Button icon="fa-solid fa-plus" label="إضافة زيارة" style="width: 150px;" class="mr-2"> </Button>
            </RouterLink>
					</div>
                    </div>
                    
                </template>
                <Column field="code" header="الإسم "  style="min-width:12rem;  " frozen></Column>
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