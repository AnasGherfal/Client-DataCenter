<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

import axios from 'axios';

 

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

    onMounted(async () => {
    await axios.get("http://localhost:3000/users")
      .then(function (response) {
        console.log(response)
        tab1.value = response.data.filter((users:{status: string;state:String}) => users.status === stateTest.stateCheck);
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
                <Column field="name" header="Name" sortable style="width: 50%"></Column>
                <Column field="status" header="status" sortable style="width: 50%"></Column>
                <Column style="min-width:8rem">

<template #body="slotProps">
<RouterLink :to="'customersRecord/CustomerProfile/'+slotProps.data.name">
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