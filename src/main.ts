import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';

//--- axios ---//
import axios from 'axios'
import VueAxios from 'vue-axios'


//style
import './assets/style/style.scss'
import    './assets/themes/lightTheme.css'
// import  './assets/themes/darkTheme.css'
import './assets/style/iconsStyle.scss'


import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
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
import Ripple from 'primevue/ripple';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import ConfirmationService from 'primevue/confirmationservice';
import Skeleton from 'primevue/skeleton';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';
import Textarea from 'primevue/textarea';

import Vue3Autocounter from 'vue3-autocounter';
import  VueSelect  from "vue-select";

const app = createApp(App)

app.use(createPinia())

app.use(router)
app.use(PrimeVue, { ripple: true });
app.use(VueAxios, axios)

app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'


app.use(ToastService);
app.component('ProgressBar', ProgressBar)
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
app.component('Divider', Divider);
app.component('InputNumber', InputNumber);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);
app.component('Skeleton', Skeleton);
app.component('Dialog', Dialog);
app.component('Checkbox', Checkbox);
app.component('Textarea', Textarea);

app.use(ConfirmationService);
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);


//------------- Data Table -------------------------
app.component('DataTable', DataTable);
app.component('Column', Column);

//Animated Number Counter
app.component('vue3autocounter', Vue3Autocounter)
.component("v-select", VueSelect)


app.mount('#app')
