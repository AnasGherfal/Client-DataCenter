import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
 
//--- axios ---//
import * as Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/style/style.scss'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css' 
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';

//global style
import Menu from 'primevue/menu';

import Menubar from 'primevue/menubar';
import ToastService from 'primevue/toastservice';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';

import Dropdown from 'primevue/dropdown';
import Tooltip from 'primevue/tooltip';
import AutoComplete from 'primevue/autocomplete';
import Calendar from 'primevue/calendar';

import MultiSelect from 'primevue/multiselect';





// console.log(RouterView)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

app.use(ToastService);

app.component('Sidebar', Sidebar);
app.component('Button', Button);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('InputText', InputText);
app.component('InputMask', InputMask);
app.component('Card', Card);
app.component('FileUpload', FileUpload);
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);
app.component('AutoComplete', AutoComplete);
app.component('Calendar', Calendar);
app.component('MultiSelect', MultiSelect);

app.directive('tooltip', Tooltip);



//------------- Data Table -------------------------
app.component('DataTable', DataTable);
app.component('Column', Column);


app.mount('#app')
