<script setup lang="ts">
import Button from 'primevue/button';
import { onMounted, ref } from 'vue';



const checked = ref<boolean>(false);
const menu = ref();
const items = ref([
{ separator: true },
    { label: 'حساب تعريفي', icon:"fa-solid fa-user", to:'/adminProfile' },
    { separator: true }

]);


const toggle = (event:any) => {
    menu.value.toggle(event);
};

const toggleTheme = (): void => {
    console.log('Toggle theme clicked');

      const themeLink = document.querySelector('link[href*="primevue/resources/themes"]') as HTMLLinkElement | null;
      console.log('themeLink:', themeLink);

      if (themeLink && themeLink.getAttribute('href')?.includes('saga-blue')) {
        themeLink.setAttribute('href', 'primevue/resources/themes/lara-light-blue/theme.css');
      } else if (themeLink) {
        themeLink.setAttribute('href', 'primevue/resources/themes/saga-blue/theme.css');
      }
    };

    onMounted(() => {
      const themeLink = document.querySelector('link[href*="primevue/resources/themes"]') as HTMLLinkElement | null;
      if (!themeLink) {
        // If link tag is not found, wait until the DOM is ready to try again
        document.addEventListener('DOMContentLoaded', () => {
          toggleTheme();
        });
      }
    });
// function theme(){

//     if(checked.value == true)
//     (async () => {
//           await import('../assets/style/darkTheme.css');
//       })();
//       else if(checked.value == false)
//     (async () => {
//           await import('../assets/style/lightTheme.css');
//       })();
// }
        
</script>
     
     <template>
    <div class="inline-flex fadeinleft animation-duration-1000" style=" height:30px; margin-top: -18px; margin-right:12px;">
        <Button @click="toggleTheme"   style="height: 40px; width: 40px; --fa-animation-iteration-count: 2;"  class="m-1 p-button-text" 
        icon="fa-solid fa-moon fa-fade" />

        
        <RouterLink to="/SettingsView" style="text-decoration: none">

        <Button  style="height: 40px; width: 40px; --fa-animation-iteration-count: 1;" icon="fa-solid fa-gear fa-spin fa-spin-hover" class="m-1 p-button-text transition-colors transition-duration-500" 
        v-tooltip="{value:'اعدادات النظام', fitContent:true}" />
        </RouterLink>

        <Button  @click="toggle"  style="height: 40px; width: 40px; --fa-animation-iteration-count: 2;" icon="fa-solid fa-ellipsis-vertical" class="m-1  p-button-text fa-bounce-hover"
         aria-haspopup="true" aria-controls="overlay_menu" v-tooltip="{value:'قائمه', fitContent:true}" />
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

    </div>
     </template>  

     <style scoped>
.ml-2 {
  margin-right: 0.5rem !important;
}

    </style>
     
    
