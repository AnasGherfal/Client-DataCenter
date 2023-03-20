<script lang="ts" setup>
import {useCustomersStore} from '@/stores/customers'

const store = useCustomersStore();

</script>

<template>
<Card>
<template #header>
    <div class="flex justify-content-between flex-wrap card-container ">
        <div class="align-items-center justify-content-center  border-round m-3 ">
                <h1 class=" m-0">فاتورة/#13</h1>
                <h5 class="text-600  m-0">مركز ادارة الخدمات والبيانات</h5>
                <div class="border-green-500 border-round-md text-center justify-content-center">
                <p class="text-md"> مدفوعة</p>
                </div>
            
        </div>
        <div class="align-items-center justify-content-center  border-round m-3 ">
               <p >تاريخ الانشاء : 12/2/2022</p> 
               <p >تاريخ الاستحقاق : 11/1/2023</p>        
       
        </div>
    </div>
</template>
<template #content>
<DataTable style="text-align: right;" :value="store.users"  stripedRows tableStyle="min-width: 50rem">
    <Column style="text-align: right;" field="id" header="id"></Column>
    <Column style="text-align: right;" field="name" header="الوصف"></Column>
    <Column style="text-align: right;" field="status" header="الكمية"></Column>
    <Column style="text-align: right;" field="endDate" header="السعر"></Column>
    
</DataTable>
</template>
</Card>
</template>

<style ></style>