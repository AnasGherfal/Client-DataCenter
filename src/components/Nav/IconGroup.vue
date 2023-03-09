<script setup lang="ts">
import Button from 'primevue/button';

</script>
     
     <template>
    <div class="inline-flex fadeinleft animation-duration-1000" style=" height:30px; margin-top: -18px; margin-right:12px;">
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-moon" class="m-1 p-button-secondary p-button-text" />
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-user " class="m-1 p-button-secondary p-button-text fa-bounce-hover" />
        <RouterLink to="/SettingsView" style="text-decoration: none">
        <Button  style="height: 40px; width: 40px;" icon="fa-solid fa-gear " class="m-1 p-button-secondary p-button-text transition-colors 
        transition-duration-500   fa-spin-hover " 
        v-tooltip.bottom="{value:'اعدادات النظام', fitContent:true}" />
        </RouterLink>
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-list  " class="m-1 p-button-secondary p-button-text" />

    </div>
     </template>  

     <style >
.fa-spin-hover:hover {
  -webkit-animation: fa-spin 2s infinite linear;
  -moz-animation: fa-spin 2s infinite linear;
  -o-animation: fa-spin 2s infinite linear;
  animation: fa-spin 2s infinite linear;
}

    </style>
     
    
