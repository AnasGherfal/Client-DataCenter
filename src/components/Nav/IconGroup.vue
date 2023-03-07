<script setup lang="ts">
import Button from 'primevue/button';

</script>
     
     <template >
    <div class="inline-flex " style=" height:30px; margin-top: -18px; margin-right:12px;">
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-moon" class="m-1 p-button-secondary p-button-text" />
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-user" class="m-1 p-button-secondary p-button-text " />
        <RouterLink to="/SettingsView" style="text-decoration: none">
        <Button  style="height: 40px; width: 40px;" icon="fa-solid fa-gear " class="m-1 p-button-secondary p-button-text" v-tooltip.bottom="{value:'اعدادات النظام', fitContent:true}" />
        </RouterLink>
        <Button style="height: 40px; width: 40px;" icon="fa-solid fa-list " class="m-1 p-button-secondary p-button-text" />

    </div>
     </template>  

     <style >

    </style>
     
    
