<template>
        <Menu class="overflow-auto fixed  mt-4" style="border-radius:15px;width: 25%; height:475px;"  :model="items" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Menu from 'primevue/menu';

        const items = ref([
            {
                label: 'لوحة المعلومات',
                items: [{
                    label: 'بطاقات الاحصائيات',
                    icon: 'pi pi-refresh',
                },
                {
                    label: 'مخطط الشهر',
                    icon: 'pi pi-times',

                }
            ]},
            {
                label: 'العملاء',
                items: [{
                    label: 'سجل العملاء',
                    icon: 'pi pi-refresh',
                },
                {
                    label: 'اضافة عميل',
                    icon: 'pi pi-times',

                },
                {
                    label: 'اضافة مندوب',
                    icon: 'pi pi-times',
                }
            ]},  {
                label: 'الخدمات',
                items: [
                {
                    label: 'سجل الخدمات',
                    icon: 'pi pi-times',
                },
                {
                    label: 'اضافة خدمة جديدة',
                    icon: 'pi pi-refresh',
                },
            ]},
            {
                label: 'Navigate',
                items: [{
                    label: 'Vue Website',
                    icon: 'pi pi-external-link',
                    to: '/home'
                },
                
            ]}
        ]);


</script>


<style lang="scss">
.p-menuitem-active{
   background-color:red;
   
}
.p-menuitem-text-active {
    cursor: pointer;
    font-weight: bold;
  }
.p-menuitem-content{
    margin: 10px;
}
.p-menuitem-text{
    margin-right: 5px;
    font-family:'29LT Zawi bold',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}

.p-submenu-header{
    font-family:'29LT Zawi Black',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}

</style>