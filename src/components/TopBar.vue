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
    <div class="
	fixed
    z-5 
	ml-3
    flex 
    align-items-center 
    justify-content-right 
    p-3 
    bg-white
    font-bold 
    text-blue-50  
    shadow-2
    " 
    style="width: 100%; height:75px;">
  	 

			
		

         <div>
			<img alt="logo"  src="../components/output-onlinepngtools.png" height="40"  style="margin-right:0px ;">
		 </div>   

			 <div>
				<h2 style="color:#1c86dd; margin-right: 5px;margin-bottom: 5px ; width:300px; height:40px;">ليبيا للاتصالات والتقنية</h2>
			 </div>

		 	<div style="width:900px; height: 50px;">
				 	<!-- <TextBar/>		 -->
             </div>

			 <IconGroup />

		<!-- <Menubar  class="nav" :model="items">
            <template #end>
               <a to="/Char"><img alt="logo"  src="./output-onlinepngtools.png" height="40" class="mr-1"></a> 
            </template>
            <TextBar></TextBar>
        </Menubar> -->

    </div>	
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