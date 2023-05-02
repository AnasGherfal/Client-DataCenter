<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useCustomersStore } from '@/stores/customers'
import router from '@/router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import AddBotton from '@/components/AddBotton.vue';
import LockButton from '@/components/LockButton.vue';

const toast = useToast();
const store = useCustomersStore();
const customersDialog = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const columns = ref([
    // {field: 'status', header: 'الحاله'},
    { field: 'email', header: 'البريد الإكتروني' },

    { field: 'address', header: 'العنوان' },
    { field: 'primaryPhone', header: 'رقم الهاتف (1)' },
    { field: 'secondaryPhone', header: 'رقم الهاتف (2)' }

]);
const selectedColumns = ref(columns.value);

const onToggle = (val: any) => {
    selectedColumns.value = columns.value.filter(col => val.includes(col));
};



const statuses = ref(['نشط', 'غير نشط', 'منتهي الصلاحيه']);

const getSeverity = (status: string) => {
    switch (status) {
        case 'نشط':
            return 'success';

        case 'غير نشط':
            return 'danger';
    }
}

const rotName = ref()

function getId(index: {}) {
    rotName.value = index;
    console.log(rotName.value.name)
    customersDialog.value = true
}

const deleteCustomer = () => {
    console.log(rotName.value)
    axios.delete('https://localhost:7003/api/Customers/' + rotName.value.id)
        .then(response => {
            store.getdata();
            toast.add({ severity: 'success', summary: 'تم الحذف', detail: response.data, life: 3000 });
            customersDialog.value = false

        });

}


</script>

<template>
    <RouterView></RouterView>

    <div v-if="($route.path === '/customersRecord')">
        <Card>

            <template #title>
                سجل العملاء
                <AddBotton name-button="اضافة عميل" rout-name="/customersRecord/addCustomer" />

            </template>
            <template #content>


            <div>

                    <div v-if="store.loading" class="border-round border-1 surface-border p-4 surface-card">
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


                    <DataTable v-else filterDisplay="row" ref="dt" :value="store.customers" dataKey="id" :paginator="true"
                        :rows="5" v-model:filters="filters" :globalFilterFields="['name', 'status']"
                        paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">
                        <template #header>

                            <div class="grid p-fluid">

                                <div class=" field col-12 md:col-6 lg:col-4 ">

                                    <div class="table-header flex flex-column md:flex-row justiify-content-between ">
                                        <span class="p-input-icon-left p-float-label ">
                                            <i class="fa-solid fa-magnifying-glass" />
                                            <InputText v-model="filters['global'].value" placeholder="" />
                                            <label for="search"> البحث </label>
                                        </span>
                                    </div>
                                </div>

                                <div class=" field col-12 md:col-6 lg:col-4 ">
                                    <MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header"
                                        @update:modelValue="onToggle" placeholder="حدد الأعمدة" />
                                </div>

                            </div>

                        </template>
                        <!-- <Column field="id" header="ID" class="font-bold" frozen></Column> -->

                        <Column field="name" header="الإسم" style="min-width:10rem;" class="font-bold" frozen></Column>

                        <Column field="status" header="  الحاله " filterField="status" style="width:2rem"
                            :showFilterMenu="false" :filterMenuStyle="{ width: '4rem' }">
                            <template #body="{ data }">

                                <Tag :value="data.status" :severity="getSeverity(data.status)" />
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses"
                                    placeholder="Select One" class="p-column-filter" style="min-width: 12rem"
                                    :showClear="true">
                                    <template #option="slotProps">
                                        <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                                    </template>
                                </Dropdown>
                            </template>

                        </Column>
                        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                            :key="col.field + '_' + index" style="min-width:10rem;  "></Column>
                        <!-- <Column field="email" header="البريد الالكتروني"  style="min-width:12rem"></Column>
                            <Column field="address" header=" العنوان"  style="min-width:12rem"></Column>
                            <Column field="primaryPhone" header="  رقم الهاتف 1"  style="min-width:12rem"></Column>
                            <Column field="secondaryPhone" header="  رقم الهاتف 2"  style="min-width:12rem"></Column> -->
                        <Column style="min-width:13rem">

                            <template #body="slotProps">

                                
                                <Button icon="fa-solid fa-trash-can" severity="danger" text rounded aria-label="Cancel"
                                @click="getId(slotProps.data)" />
                                
                                <RouterLink :to="'customersRecord/CustomerProfile/' + slotProps.data.id">
                                    <Button icon="fa-solid fa-user" severity="info" text rounded aria-label="Cancel" />
                                </RouterLink>
                                
                                <LockButton typeLock="Customers" :id="slotProps.data.id" />
                                <Dialog v-model:visible="customersDialog" :style="{ width: '450px' }" header="تأكيد"
                                    :modal="true">

                                    <div class="confirmation-content">
                                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: red;" />
                                        <span v-if="rotName">هل انت متأكد من حذف <b>{{ rotName.name }}</b> ؟</span>
                                    </div>
                                    <template #footer>
                                        <Button label="نعم" icon="pi pi-check" text @click="deleteCustomer" />
                                        <Button label="لا" icon="pi pi-times" text @click="customersDialog = false" />
                                    </template>


                                </Dialog>

                            </template>

                        </Column>
                        <Toast position="bottom-left" />


                    </DataTable>
                </div>
            </template>
        </Card>

    </div>
</template>

<style></style>