<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';
import { toNumber } from '@vue/shared';

 

        const toast = useToast();
        const op = ref();
        const productService = ref();
        const products = ref();
        const selectedProduct = ref();
        const toggle = () => {
            op.value.toggle(event);
        };
        const formatCurrency = () => {
            return ;
        };
        const onProductSelect = () => {
            op.value.hide();
            
        };
        const stateTest =defineProps<{
            stateCheck: string
            iconShape: string
        }>()
        const tab1=ref()
console.log(stateTest.stateCheck)
const test= toNumber(stateTest.stateCheck)
    onMounted(async () => {
    await axios.get("https://localhost:7003/api/subscription?PageNumber=1&PageSize=20")
      .then(function (response) {
        console.log(response)
        tab1.value = response.data.content.filter((users:{status: number}) => users.status === test);
      })
      .catch(function (error) {
        console.log(error)
      })
    })
    console.log(tab1)

</script>

<template>

    <div>
        <Toast />

        <Button type="button" :icon="iconShape"  @click="toggle" aria-haspopup="true" aria-controls="overlay_panel" />

        <OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px" :breakpoints="{'800px':'50vw'}">
            <DataTable :value="tab1" v-model:selection="selectedProduct" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onProductSelect" responsiveLayout="scroll" >
                <Column field="id" header="id" sortable style="width: 50%"></Column>
                <Column field="customerName" header="customer Name" sortable style="width: 50%"></Column>
                <Column field="serviceName" header="service Name" sortable style="width: 50%"></Column>
                <Column field="status" header="status" sortable style="width: 50%"></Column>
                <Column style="min-width:8rem">

<template #body="slotProps">
<RouterLink :to="'subscriptionsRecord/SubscriptionsDetaView/'+slotProps.data.id">
<Button icon="fa-solid fa-user"  text rounded aria-label="Cancel"/>
</RouterLink>
</template>
</Column>
            </DataTable>
        </OverlayPanel>
    </div>
</template>



<style lang="scss" scoped>


.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}


.p-button[data-v-a8d0e435] {

  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  height: 45px;
  }
</style>