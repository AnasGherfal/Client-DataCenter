<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import router from '@/router';
import axios from 'axios';
import AddBotton from '@/components/AddBotton.vue';
import { useVistisStore } from '@/stores/visits'
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';


const store = useVistisStore();
const loading = ref(true);
const toast = useToast();
const visitsDialog = ref(false);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([

    { field: 'address', header: 'تاريخ بداية الاشتراك' },
    { field: 'phoneNumber1', header: 'تاريخ انتهاء الاشتراك' },
    { field: 'phoneNumber2', header: 'الباقه' }

]);
const selectedColumns = ref(columns.value);

const rotName = ref()


function getId(index: {}) {
    rotName.value = index;
    console.log(rotName.value.name)
    visitsDialog.value = true
}

const deleteVisit = () => {
    console.log(rotName.value)
    axios.delete('http://localhost:3000/visits/' + rotName.value.id)
        .then(response => {
            console.log(response)
            store.getdata();
            toast.add({ severity: 'success', summary: 'تم الحذف', detail: response.data.msg, life: 3000 });
            visitsDialog.value = false

        });

}
</script>

<template>
    <RouterView></RouterView>

    <div v-if="$route.path === '/VisitsRecords'">

        <Card>
            <template #title>
                سجل الزيارات
                <AddBotton name-button="إنشاء زياره" rout-name="/visitsRecords/createVisit" />

            </template>
            <template #content>
                <DataTable :value="store.visits" dataKey="id" filterDisplay="row"
                    :globalFilterFields="['name', 'visitReason']" :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} سجل الزيارات"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="grid p-fluid">

                            <div class=" field col-12 md:col-6 lg:col-4 ">
                                <span class="p-input-icon-left p-float-label ">
                                    <i class="fa-solid fa-magnifying-glass" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    <label for="search"> البحث </label>

                                </span>
                            </div>

                        </div>

                    </template>
                    <Column field="name" header="اسم العميل " style="min-width:12rem;"></Column>
                    <Column field="visitReason" header="سبب الزياره" style="min-width:12rem"></Column>
                    <Column field="visitDuration" header=" المده" style="min-width:12rem"></Column>
                    <Column field="visitPrice" header="السعر" style="min-width:5rem"></Column>
                    <Column style="min-width:8rem">
                        <template #body="slotProps">

                            <RouterLink :to="'/visitsRecords/vistDetails/' + slotProps.data.name"
                                style="text-decoration: none">
                                <Button icon="fa-solid fa-circle-info" severity="info" text rounded
                                    v-tooltip="{ value: 'التفاصيل', fitContent: true }" />
                            </RouterLink>


                            <Button @click="getId(slotProps.data)" v-tooltip="{ value: 'مسح', fitContent: true }" icon="fa-solid fa-trash"
                                severity="danger" text rounded ></Button>

                            <Dialog v-model:visible="visitsDialog" :style="{ width: '450px' }" header="تأكيد" :modal="true">

                                <div class="confirmation-content">
                                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: red;" />
                                    <span v-if="rotName">هل انت متأكد من حذف <b>{{ rotName.name }}</b> ؟</span>
                                </div>
                                <template #footer>
                                    <Button label="لا" icon="pi pi-times" text @click="visitsDialog = false" />
                                    <Button label="نعم" icon="pi pi-check" text @click="deleteVisit" />
                                </template>


                            </Dialog>

                        </template>
                    </Column>
                    <Toast position="bottom-left" />


                </DataTable>
            </template>
        </Card>

    </div>
</template>

<style></style>