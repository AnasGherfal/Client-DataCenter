<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue';

const menu = ref();
const items = ref([
{ separator: true },
    { label: 'Profile', icon: 'pi pi-fw pi-user' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog' },
    { separator: true }

]);


const toggle = (event:any) => {
    menu.value.toggle(event);
};
</script>
     
     <template>
    <div class="inline-flex fadeinleft animation-duration-1000" style=" height:30px; margin-top: -18px; margin-right:12px;">
        <Button style="height: 40px; width: 40px; --fa-animation-iteration-count: 2;" icon="fa-solid fa-moon fa-fade" class="m-1 p-button-secondary p-button-text"  />
        <Button  @click="toggle"  style="height: 40px; width: 40px; --fa-animation-iteration-count: 2;" icon="fa-solid fa-user fa-bounce" class="m-1 p-button-secondary p-button-text fa-bounce-hover" aria-haspopup="true" aria-controls="overlay_menu" />
        <Menu ref="menu" :model="items" :popup="true" >
          <template #start>
                <button @click="" class="w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
                    <div class="flex flex-column align">
                        <span class="font-bold">Admin</span>
                    </div>
                </button>
            </template>
            <template #end>
                <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
                    <i class="pi pi-sign-out" />
                    <span class="ml-2">تسجيل الخروج</span>
                </button>
            </template>
        </Menu>
        
        <RouterLink to="/SettingsView" style="text-decoration: none">
        <Button  style="height: 40px; width: 40px; --fa-animation-iteration-count: 1;" icon="fa-solid fa-gear fa-spin" class="m-1 p-button-secondary p-button-text transition-colors 
        transition-duration-500   fa-spin-hover " 
        v-tooltip.bottom="{value:'اعدادات النظام', fitContent:true}" />
        </RouterLink>
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-list  " class="m-1 p-button-secondary p-button-text" />

    </div>
     </template>  

     <style scoped>
.ml-2 {
  margin-right: 0.5rem !important;
}

    </style>
     
    
