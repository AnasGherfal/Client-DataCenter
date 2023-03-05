<template>
    <div>
        <Toast />

        <Button type="button" icon="pi pi-ban"  @click="toggle" aria-haspopup="true" aria-controls="overlay_panel" />

        <OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px" :breakpoints="{'960px':'75vw'}">
            <DataTable :value="products" v-model:selection="selectedProduct" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onProductSelect" responsiveLayout="scroll" >
                <Column field="name" header="Name" sortable style="width: 50%"></Column>
                <Column header="Image" style="width: 20%">
                    <template #body="slotProps">
                        <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="slotProps.data.image" class="product-image" />
                    </template>
                </Column>
                <Column field="price" header="Price" sortable style="width: 30%">
                    <template #body="slotProps">
                        {{formatCurrency()}}
                    </template>
                </Column>
            </DataTable>
        </OverlayPanel>
    </div>
</template>

<script setup lang="ts">
import OverlayPanel from 'primevue/overlaypanel';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';


    

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


</script>

<style lang="scss" scoped>
.p-button{
    background-color: red;
    height: 35px;
    width: 35px;
    border-radius: 0.5rem;
}
.p-button:hover{
    background-color: red !important;

}
.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}
.p-overlaypanel{
    background-color: red;
}
.p-button {
  color: #ffffff;
  background: rgb(243, 33, 33);
  border: 1px solid #F32121;
    border-top-color: rgb(243, 33, 33);
    border-right-color: rgb(243, 33, 33);
    border-bottom-color: rgb(243, 33, 33);
    border-left-color: rgb(243, 33, 33);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-radius: 3px;
}
</style>