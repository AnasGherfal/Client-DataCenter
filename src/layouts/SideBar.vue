<script lang="ts" setup>
import { ref } from 'vue';
import Menu from 'primevue/menu';
import Tooltip from 'primevue/tooltip';

        const items = ref([
            {
                label: 'لوحة المعلومات',
                items: [{
                    label: 'الصفحة الرئيسية',
                    icon: 'fa-solid fa-house',
                    to: '/'
                },

            ]},
            {
                label: 'العملاء',
                items: [
                {
                    label: 'اضافة عميل',
                    icon: 'fa-solid fa-user-plus',
                    to: 'users',

                
                },
                    {
                    
                    label: 'سجل العملاء',
                    icon: 'fa-solid fa-users',
                    to:'/UsersRecord'
                    
                }
            ]},
              
            {
                label: 'الزيارات',
                items: [
                {
                    label: 'انشاء زيارة ',
                    icon: 'fa-solid fa-circle-plus',
                    to: '/CreateVisit'
                },
                    {
                    
                    label: 'سجل الزيارات',
                    icon: 'fa-solid fa-book',
                    to:'/VisitsRecords'
                }
            ]}
            ,{
                label: 'الباقات',
                items: [
                {
                    label: 'سجل الاشتراكات',
                    icon: 'pi pi-server',
                },
                {
                    label: 'اضافة اشتراك',
                    icon: 'pi pi-plus-circle',
                    to:'/AddService',
                },
                {
                    label: 'الباقات',
                    icon: 'pi pi-plus-circle',
                    to: '/Services'
                },
            ]},
            
                
        

        ]);

        const visible= ref( true)



</script>

<template>

    <Menu  class="overflow-auto fixed  mt-4 fadeinright animation-duration-500" style="border-radius:15px;width: 25%; height: calc(100vh - 7.6rem);"  :model="items" />

</template>



<style lang="scss">
.p-menuitem:hover{
    background-color: none !important;
}

.p-menuitem-content{
    margin: 10px;
}
.p-menuitem-text{
    color: #1643a0 !important;

    margin-right: 5px;
    color: black !important;
    font-family: 'Tajawal';
}

.p-submenu-header{
    color: #1643a0 !important;
    font-family:'tajawal';
    font-weight: 800 !important;  
}
.p-menuitem {
    .router-link-active
    {
    border-radius: 20px;
    border-color: #175deb46;
    border-style:solid ;
    border-width:3px;
    }
}
.p-menuitem-link:hover{
    border-radius: 20px;

}
    .router-link-active{
        .p-menuitem-icon{
            color: navy !important;
        }
        .p-menuitem-text{
            font-weight:600;
        }

    }

    .p-menu .p-menuitem:not(.p-highlight):not(.p-disabled) > .p-menuitem-content:hover {
  background-color: rgba(84, 118, 199, 0.386);
  border-radius: 20px;
}

.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus > .p-menuitem-content {
    background-color: rgba(84, 118, 199, 0.386);
  border-radius: 20px;
}

@media screen and (max-width: 600px) {
.p-menuitem-text	{
    display:none;
}
    
}

@media screen and (max-width: 300px) {
    .p-menu{
    display: none;
}
}

// class="p-menuitem-link router-link-active router-link-active-exact"
</style>