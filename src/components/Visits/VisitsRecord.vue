<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import router from '@/router';
import axios from 'axios';


const visits = ref(['']);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});



onMounted(async () => {
    await axios.get("http://localhost:3000/visits")
      .then(function (response) {
        visits.value = response.data;
        console.log(visits)
      })
      .catch(function (error) {
        console.log(error)
      })

  })

  const rotName = ref()
  function openVisitsDetails(index:{}){
    rotName.value = index
    router.push("/visitsRecords/vistDetails/" + rotName.value.name )
  }
</script>

<template>
        <RouterView></RouterView>

    <div v-if="$route.path === '/visitsRecords'">
       
        <Card>
            <template #title>
                سجل الزيارات
            </template>
            <template #content>
            <DataTable :value="visits" dataKey="id"        filterDisplay="row"
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
                <Button icon="fa-solid fa-plus" label="انشاء زيارة" style="width: 150px;" class="mr-2"> </Button>
            </RouterLink>
					</div>
                    </div>
                    
                </template>
                <Column field="name" header="اسم العميل "  style="min-width:12rem;"></Column>
                <Column field="visitReason" header="سبب الزياره"  style="min-width:12rem"></Column>
                <Column field="visitDuration" header=" المده"  style="min-width:12rem"></Column>
                <Column field="visitPrice" header="السعر"  style="min-width:5rem"></Column>
                <Column  style="min-width:8rem">
                    <template #body="slotProps">

                <Button @click="openVisitsDetails(slotProps.data)" v-tooltip="{value:'التفاصيل', fitContent:true}" icon="fa-solid fa-circle-info"  severity="info" text rounded></Button>
                <Button v-tooltip="{value:'مسح', fitContent:true}" icon="fa-solid fa-trash"  severity="danger" text rounded></Button>

                    </template><i class="fa-solid fa-circle-info"></i>
                </Column>

</DataTable>
</template>
</Card>

    </div>
</template>

<style>



</style>