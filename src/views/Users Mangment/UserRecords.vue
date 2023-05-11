<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { ResponsUserModel } from '../../Models/UserModel/ResponsUserModel'
import AddBotton from '@/components/AddBotton.vue';

const state:ResponsUserModel = reactive({
     Email:"",
     FullName:"",
     EmpId:null,
     startDate:"",
     Status:null,
})



</script>

<template>
   <RouterView></RouterView>

<div v-if="$route.path === '/UsersRecord'">
<card>
        <template #title>
سجل المستخدمين
<AddBotton name-button="اضافة عميل" rout-name="/UsersRecord/AddUser" />

            <Divider/>

        </template>
        <template #content>
            <DataTable ref="dt" :value="subDeta" dataKey="id" :paginator="true" :rows="5" v-model:filters="filters"
                    :globalFilterFields="['serviceName', 'customerName']"
                    paginatorTemplate=" PrevPageLink PageLinks   NextPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="عرض {first} الى {last} من {totalRecords} عميل" responsiveLayout="scroll">

                    
                    <Column field="customerName" header="اسم الموظف" style="min-width:10rem;" class="font-bold"></Column>
                    
                    <Column field="customerName" header="الرقم الوظيفي" style="min-width:10rem;" class="font-bold"></Column>

                    <Column field="status" header="حالة الحساب"  dataType="date" style="min-width:10rem;" >
                            <template #body="{ data }">
                                {{ status(data.status) }}
                            </template>
                    </Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
                        :key="col.field + '_' + index" style="min-width:5rem;  "></Column>
                        

                        <Column field="startDate" header="تاريخ انشاء الحساب"  dataType="date" style="min-width:11rem;" >
                            <template #body="{ data }">
                             {{ formatDate(data.startDate) }}
                          </template>
                        </Column>


                        <Column style="min-width:3rem">
                        <template #body="slotProps">

                  <RouterLink :key="slotProps.data.id"  :to="'/subscriptionsRecord/SubscriptionsDetaView/' + slotProps.data.id" style="text-decoration: none">
                   <Button icon="fa-solid fa-circle-info" severity="info" text rounded 
                  v-tooltip="{ value: 'التفاصيل', fitContent: true }"  />
                  </RouterLink>
 
                   </template>
                   </Column>
                </DataTable>
        </template>

        
    </card>
    </div>
</template>

<style>
</style>