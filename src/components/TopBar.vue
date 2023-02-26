<script lang="ts" setup>
import TextBar from './Nav/TextBar.vue';
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

<template #start>
        <Menubar  class="nav" :model="items">
            <template #end>
               <a to="/Char"><img alt="logo"  src="./output-onlinepngtools.png" height="40" class="mr-1"></a> 
            </template>
            <TextBar></TextBar>
        </Menubar>
    <!-- <div class="card">
        <div>
        <Menubar class="nav" :model="items">
            <template #end>
               <a to="/Char"><img alt="logo"  src="./output-onlinepngtools.png" height="40" class="mr-1"></a> 
            </template>
            <TextBar></TextBar>
        </Menubar>

    </div> 
            <div class="absolute overflow-auto surface-overlay mt-6 p-4 line-height-3" style="height: 150px">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Vitae sapien pellentesque habitant morbi tristique senectus et netus. Vitae proin sagittis nisl rhoncus mattis.
                    Maecenas pharetra convallis posuere morbi leo urna molestie. At in tellus integer feugiat scelerisque.
                    Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Luctus accumsan tortor posuere ac ut.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Vitae sapien pellentesque habitant morbi tristique senectus et netus. Vitae proin sagittis nisl rhoncus mattis.
                    Maecenas pharetra convallis posuere morbi leo urna molestie. At in tellus integer feugiat scelerisque.
                    Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Luctus accumsan tortor posuere ac ut.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Vitae sapien pellentesque habitant morbi tristique senectus et netus. Vitae proin sagittis nisl rhoncus mattis.
                    Maecenas pharetra convallis posuere morbi leo urna molestie. At in tellus integer feugiat scelerisque.
                    Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Luctus accumsan tortor posuere ac ut.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Vitae sapien pellentesque habitant morbi tristique senectus et netus. Vitae proin sagittis nisl rhoncus mattis.
                    Maecenas pharetra convallis posuere morbi leo urna molestie. At in tellus integer feugiat scelerisque.
                    Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Luctus accumsan tortor posuere ac ut.
            </div>
        </div>

  -->

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