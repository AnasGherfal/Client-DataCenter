<script lang="ts" setup>
import { ref } from 'vue';

        const items = ref([
            {
                label: 'لوحة المعلومات',
                items: [{
                    label: 'الصفحة الرئيسية',
                    icon: 'fa-solid fa-house',
                    to: '/'
                },
                ]}

                ,{
                label: 'السجلات',
                items: [
                    {
                    
                    label: 'سجل العملاء',
                    icon: 'fa-solid fa-users',
                    to:  '/customersRecord',
                    
                },
              
            
                    {
                    
                    label: 'سجل الزيارات',
                    icon: 'fa-solid fa-book',
                    to:'/VisitsRecords'
                },
   
                {
                    label: 'سجل الاشتراكات',
                    icon: 'fa-solid fa-calculator',
                    to:'/SubscriptionsRecord'
                },
                {
                    label: ' سجل الفواتير',
                    icon: 'fa-solid fa-receipt',
                    to:'/invoices'
                }


            ]},
            
                
        

        ]);

        const menu = ref();

        const toggle = (event:any) => {
        menu.value.toggle(event);
         };
         


</script>

<template>
    <Menu  ref="menu"  :model="items" :popup="false" class="sidebar overflow-auto fixed  mt-4 fadeinright animation-duration-500" style="border-radius:15px;width: 25%; height: calc(100vh - 7.6rem);" >
    </Menu>

    <div>
       <Button style="display:none;" 
       class="SideBarbutton fixed " 
       type="button" 
       icon="fa-solid fa-bars" text  
       aria-label="Filter" @click="toggle" 
       aria-haspopup="true" 
       aria-controls="overlay_menu" 
       v-tooltip="{value:'الشريط الجانبي', fitContent:true}" />
       
       <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
       <Toast />
   </div>

</template>



<style lang="scss">
.p-menuitem:hover{
    background-color: none !important;
}

.p-menuitem-content{
    margin: 10px;
    
}
.p-menuitem-text{
    color: var(--primary-color);

    margin-right: 5px;
    font-family: 'Tajawal';
}

.p-submenu-header{
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
            color: var(--primary-color) !important;
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
    .sidebar{
    display:none;
}
.sidebar	{
    display:none;
}
.SideBarbutton{
    display:inline !important;
    top:60px
}
}



// class="p-menuitem-link router-link-active router-link-active-exact"
</style>