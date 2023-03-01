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
                    icon: 'pi pi-chart-bar',
                    to:'/ChartInfo'

                }
            ]},
            {
                label: 'العملاء',
                items: [{
                    label: 'سجل العملاء',
                    icon: 'pi pi-users',
                },
                {
                    label: 'اضافة عميل',
                    icon: 'pi pi-user-plus',

                },
                {
                    label: 'اضافة مندوب',
                    icon: 'pi pi-user-plus',
                }
            ]},  {
                label: 'الخدمات',
                items: [
                {
                    label: 'سجل الخدمات',
                    icon: 'pi pi-server',
                },
                {
                    label: 'اضافة خدمة جديدة',
                    icon: 'pi pi-plus-circle',
                },
            ]},
            
                
        
        ]);


</script>


<style lang="scss">

.p-menuitem-icon{
    color: #1643a0 !important;
;
}
.p-menuitem-content{
    margin: 10px;
}
.p-menuitem-text{
    color: #1643a0 !important;

    margin-right: 5px;
    font-family:'29LT Zawi bold',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    
}

.p-submenu-header{
    color: #1643a0 !important;
    font-family:'29LT Zawi Black',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}
.p-menuitem {
    .router-link-active
    {
    font-family:'29LT Zawi bold' !important;
    background-color: rgba(12, 12, 183, 0.199);
    border-radius: 200px;
    }
}

</style>