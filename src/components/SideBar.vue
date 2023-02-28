<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu';
import { RouterLink, RouterView } from 'vue-router'
import Listbox from 'primevue/listbox';
import { ref } from 'vue';
import 'primeicons/primeicons.css';
const selectedGroupedCity = ref();
const groupedCities = ref([
            {label:'لوحة المعلومات',
                items: [
                    {label: 'لوحة المعلومات', value: 'Berlin'},
                    {label: 'سجل العملاء', value: 'Frankfurt'},
                    {label: 'الطلبات', value: 'Hamburg', to:'/about', icon:'pi-eraser'},
                    {label: 'التقارير', value: 'Munich'}
                ]
            },
            
                    {label: 'Chicago', value: 'Chicago'},
                    {label: 'Los Angeles', value: 'Los Angeles'},
                    {label: 'New York', value: 'New York'},
                    {label: 'San Francisco', value: 'San Francisco'}
                
            
           
            ]);

        // const items = ref([
        //     {
        //         key: '0',
        //         label: 'لوحة المعلومات',
        //         icon: 'pi pi-fw pi-file',
        //         items: [{
        //                 key: '0_0',
        //                 label: 'New',
        //                 icon: 'pi pi-fw pi-plus',
        //                 items: [{
        //                         key: '0_0_0',
        //                         label: 'Bookmark',
        //                         icon: 'pi pi-fw pi-bookmark'
        //                     },
        //                     {
        //                         key: '0_0_1',
        //                         label: 'Video',
        //                         icon: 'pi pi-fw pi-video'
        //                     }
        //                 ]
        //             },
        //             {
        //                 key: '0_1',
        //                 label: 'Delete',
        //                 icon: 'pi pi-fw pi-trash',
        //                 to:'/home'
        //             },
        //             {
        //                 key: '0_2',
        //                 label: 'Export',
        //                 icon: 'pi pi-fw pi-external-link'
        //             }
        //         ]
        //     },
        //     {
        //         key: '1',
        //         label: 'Edit',
        //         icon: 'pi pi-fw pi-pencil',
        //         items: [{
        //                 key: '1_0',
        //                 label: 'Left',
        //                 icon: 'pi pi-fw pi-align-left'
        //             },
        //             {
        //                 key: '1_1',
        //                 label: 'Right',
        //                 icon: 'pi pi-fw pi-align-right'
        //             },
        //             {
        //                 key: '1_2',
        //                 label: 'Center',
        //                 icon: 'pi pi-fw pi-align-center'
        //             },
        //             {
        //                 key: '1_3',
        //                 label: 'Justify',
        //                 icon: 'pi pi-fw pi-align-justify'
        //             }
        //         ]
        //     },
        //     {
        //         key: '2',
        //         label: 'Users',
        //         icon: 'pi pi-fw pi-user',
        //         items: [{
        //                 key: '2_0',
        //                 label: 'New',
        //                 icon: 'pi pi-fw pi-user-plus',

        //             },
        //             {
        //                 key: '2_1',
        //                 label: 'Delete',
        //                 icon: 'pi pi-fw pi-user-minus',
        //             },
        //             {
        //                 key: '2_2',
        //                 label: 'Search',
        //                 icon: 'pi pi-fw pi-users',
        //                 items: [{
        //                         key: '2_2_0',
        //                         label: 'Filter',
        //                         icon: 'pi pi-fw pi-filter',
        //                         items: [{
        //                             key: '2_2_0_0',
        //                             label: 'Print',
        //                             icon: 'pi pi-fw pi-print'
        //                         }]
        //                     },
        //                     {
        //                         key: '2_2_1',
        //                         icon: 'pi pi-fw pi-bars',
        //                         label: 'List'
        //                     }
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         key: '3',
        //         label: 'Events',
        //         icon: 'pi pi-fw pi-calendar',
        //         items: [{
        //                 key: '3_0',
        //                 label: 'Edit',
        //                 icon: 'pi pi-fw pi-pencil',
        //                 items: [{
        //                         key: '3_0_0',
        //                         label: 'Save',
        //                         icon: 'pi pi-fw pi-calendar-plus'
        //                     },
        //                     {
        //                         key: '3_0_0',
        //                         label: 'Delete',
        //                         icon: 'pi pi-fw pi-calendar-minus'
        //                     },
        //                     {
        //                         key: '3_0_0',
        //                         label: 'Delete',
        //                         icon: 'pi pi-fw pi-calendar-minus'
        //                     },
        //                     {
        //                         key: '3_0_0',
        //                         label: 'Delete',
        //                         icon: 'pi pi-fw pi-calendar-minus'
        //                     }
        //                 ]
        //             },
        //             {
        //                 key: '3_1',
        //                 label: 'Archieve',
        //                 icon: 'pi pi-fw pi-calendar-times',
        //                 items: [{
        //                     key: '3_1_0',
        //                     label: 'Remove',
        //                     icon: 'pi pi-fw pi-calendar-minus'
        //                 }]
        //             },
                    
        //         ]
        //     }
        // ]);

       
        

 
</script>

<template>
        <div >

            <Listbox class="fixed "
             v-model="selectedGroupedCity"
             
             :options="groupedCities" 
             optionLabel="label" 
             style="width:303px; 
             height:461px;
             margin-top: 20px;
             margin-left: 5px;
             border-radius:17px;
             font-family:'29LT Zawi Black'"
             optionGroupLabel="label"
             optionGroupChildren="items"
             listStyle="max-height:459px;border-radius:18px;text-align:center;">

            <template #optiongroup="slotProps">
                <div class="flex align-items-center country-item">
                    <div>{{slotProps.option.label}}</div>
                </div>
            </template>

        </Listbox>
    </div>
       <!-- <div class="fixed"
        style="width:303px; 
             height:461px;
             margin-top: 30px;
             margin-left: 5px;
             border-radius:11px;
             background-color:white;">
        <PanelMenu end style="margin-left: 5px;margin-top: 11px;" :model="items" />
       </div>  -->
</template>

<style lang="scss">
.p-menuitem{
    border: 0px;
    color:rgb(3, 3, 81);
    background-color:rgb(3, 3, 81);

}
.p-menuitem-text{
    color:rgb(3, 3, 81);
}
.p-submenu-list{
align-content:center;
background-color:rgb(3, 3, 81);

}

.p-panelmenu{
    width: 290px;
    align-items: center;
    border: 0;

    }

.router-link-active{
        background-color: rgb(152, 152, 152);
        border-radius: 30px;
}
.p-menuitem-icon{
    color:rgb(3, 3, 81);
}
.p-submenu-icon{
    color:rgb(3, 3, 81);
}
    .p-panelmenu-header-action{
      border-style:none; 
      border-width: 0px;
    }

    .p-panelmenu-header-content{
        border-width: 0px;
    }

    // p-menuitem-link router-link-active router-link-active-exact
</style>



