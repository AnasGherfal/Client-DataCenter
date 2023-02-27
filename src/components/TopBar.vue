<script lang="ts" setup>
import TextBar from './Nav/TextBar.vue';
import IconGroup from './Nav/IconGroup.vue';

import { ref } from 'vue';
const items = ref([
				{
				label:'File',
				icon:'pi pi-fw pi-file',
                
				items:[
						{
							label:'New',
							icon:'pi pi-fw pi-plus',
							items:[
								{   to:'/Char',
									label:'Bookmark',
									icon:'pi pi-fw pi-bookmark'
								},
								{
									label:'Video',
									icon:'pi pi-fw pi-video'
								}
							]
						},
						{
							label:'Delete',
							icon:'pi pi-fw pi-trash'
						},
						{
							separator:true
						},
						{
							label:'Export',
							icon:'pi pi-fw pi-external-link'
						}
					]
				},
				{
					label:'Edit',
					icon:'pi pi-fw pi-pencil',
					items:[
						{
							label:'Left',
							icon:'pi pi-fw pi-align-left'
						},
						{
							label:'Right',
							icon:'pi pi-fw pi-align-right'
						},
						{
							label:'Center',
							icon:'pi pi-fw pi-align-center'
						},
						{
							label:'Justify',
							icon:'pi pi-fw pi-align-justify'
						},
					]
				},
				{
					label:'Users',
					icon:'pi pi-fw pi-user',
					items:[
						{
							label:'New',
							icon:'pi pi-fw pi-user-plus',
						},
						{
							label:'Delete',
							icon:'pi pi-fw pi-user-minus',
						},
						{
							label:'Search',
							icon:'pi pi-fw pi-users',
							items:[
								{
									label:'Filter',
									icon:'pi pi-fw pi-filter',
									items:[
										{
											label:'Print',
											icon:'pi pi-fw pi-print'
										}
									]
								},
								{
									icon:'pi pi-fw pi-bars',
									label:'List'
								}
							]
						}
					]
				},
				{
					label:'Events',
					icon:'pi pi-fw pi-calendar',
					items:[
						{
							label:'Edit',
							icon:'pi pi-fw pi-pencil',
							items:[
								{
									label:'Save',
									icon:'pi pi-fw pi-calendar-plus'
								},
								{
									label:'Delete',
									icon:'pi pi-fw pi-calendar-minus'
								}
							]
						},
						{
							label:'Archieve',
							icon:'pi pi-fw pi-calendar-times',
							items:[
								{
									label:'Remove',
									icon:'pi pi-fw pi-calendar-minus'
								}
							]
						}
					]
				},
				{
					label:'Quit',
					icon:'pi pi-fw pi-power-off'
				}
			]);
</script>

<template>			 
<div class="inline-flex ">
				<IconGroup />
             </div>

			
			<div style="width:900px; height: 50px;">
				 	<!-- <TextBar/>		 -->
             </div>
			 <div>
				<h2 style="margin-bottom: 5px; width:200px; height:40px;">ليبيا للاتصالات والتقنية</h2>
			 </div>

         <div>
			<img alt="logo"  src="https://lttgate.network.ltt.ly/img/66094012_10156891242319998_8911186738307661824_o.19a8d21d.png" height="40" class="mr-1" style="margin-right:10px ;">
		 </div>   
		 
		
		<!-- <Menubar  class="nav" :model="items">
            <template #end>
               <a to="/Char"><img alt="logo"  src="./output-onlinepngtools.png" height="40" class="mr-1"></a> 
            </template>
            <TextBar></TextBar>
        </Menubar> -->


</template>

<style scoped>
.nav{
    text-align: end;
    background-color:rgb(247, 249, 255) ;
   
    width: 99%;
    height: 60px;

    position:absolute ;
    z-index: 2;
}
</style>