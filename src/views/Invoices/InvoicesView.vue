<template>
    <Card>
        <template #title>
            سجل الفواتير
        </template>
        <template #content>
    <div class="p-grid">
          <p v-if="isLoading">Loading bills record...</p>
          <p v-else-if="bills.length === 0">No bills found.</p>
          <div v-else>
            <div class="p-d-flex p-ai-center p-mb-2">
              <div class="p-field">
                <label for="customer">Customer:</label>
                <div class="p-inputgroup">
                  <Dropdown :options="customers" v-model="selectedCustomer" optionLabel="name" optionValue="id" @change="loadBills"></Dropdown>
                </div>
              </div>
              <div class="p-field p-ml-3">
                <label for="dateRange">Date Range:</label>
                <div class="p-inputgroup">
                  <Calendar v-model="startDate" input-style-class="p-mr-2"></Calendar>
                  <Calendar v-model="endDate" input-style-class="p-ml-2"></Calendar>
                </div>
              </div>
            </div>
            <DataTable :value="bills" :paginator="true" :rows="10" :totalRecords="totalBills" :loading="isLoading" >
              <Column field="id" header="ID" sortable></Column>
              <Column field="date" header="Date" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column field="status" header="Status" sortable></Column>
            </DataTable>
          </div>
        </div>

</template>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  
  interface Customer {
    id: number;
    name: string;
  }
  
  interface Bill {
    id: number;
    customerId: number;
    date: Date;
    amount: number;
    status: string;
  }
  
  const selectedCustomer = ref<Customer | null>(null);
  const startDate = ref<Date | null>(null);
  const endDate = ref<Date | null>(null);
  const bills = ref<Bill[]>([]);
  const totalBills = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const customers = ref<Customer[]>([]);
  
  const dummyData: Bill[] = [
    {
      id: 1,
      customerId: 1,
      date: new Date(2022, 1, 1),
      amount: 1000,
      status: 'مدفوع'
    },
    {
      id: 2,
      customerId: 1,
      date: new Date(2022, 2, 15),
      amount: 500,
      status: 'قيد الانتظار'
    },
    {
      id: 3,
      customerId: 2,
      date: new Date(2022, 3, 10),
      amount: 750,
      status: 'مدفوع'
    },
    {
      id: 4,
      customerId: 3,
      date: new Date(2022, 4, 5),
      amount: 2000,
      status: 'غير مدفوع'
    },
    {
      id: 5,
      customerId: 4,
      date: new Date(2022, 5, 20),
      amount:  212,
      status: 'مدفوع'
    },  
]

    const loadBills = () => {
isLoading.value = true;
    }

const filteredBills = dummyData.filter((bill) => {
if (!selectedCustomer.value) {
return true;
}

if (bill.customerId !== selectedCustomer.value.id) {
  return false;
}

if (startDate.value && bill.date.getTime() < startDate.value.getTime()) {
      return false;
    }

    if (endDate.value && bill.date.getTime() > endDate.value.getTime()) {
      return false;
    }

return true;



});
bills.value = filteredBills;
totalBills.value = filteredBills.length;
isLoading.value = false;

watch([selectedCustomer, startDate, endDate], loadBills);
onMounted(() => {
customers.value = [
{ id: 1, name: 'Customer 1' },
{ id: 2, name: 'Customer 2' },
{ id: 3, name: 'Customer 3' },
{ id: 4, name: 'Customer 4' },
];
});
</script>