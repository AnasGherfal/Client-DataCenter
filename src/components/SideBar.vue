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
                    to: '/'
                },
                {
                    label: 'مخطط الشهر',
                    icon: 'pi pi-chart-bar',
                    to:'/ChartInfo'

                }
            ]},
            {
                label: 'العملاء',
                items: [
                {
                    label: 'اضافة عميل',
                    icon: 'fa-solid fa-user-plus',
                    to: '/users'

                },
                    {
                    
                    label: 'سجل العملاء',
                    icon: 'fa-solid fa-users',
                    to:'/UsersRecord'
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

        ]);


</script>


<style lang="scss">


.p-menuitem-content{
    margin: 10px;
}
.p-menuitem-text{
    margin-right: 5px;
    color: black !important;
    font-family:'29LT Zawi bold',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    
}

.p-submenu-header{
    font-family:'29LT Zawi Black',Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;  
}
.p-menuitem {
    .router-link-active
    {
    border-radius: 200px;
}
}
    .router-link-active{
        .p-menuitem-icon{
            color: navy !important;
        }
        .p-menuitem-text{
            color: navy !important;
        }
        


    }

// class="p-menuitem-link router-link-active router-link-active-exact"
</style>