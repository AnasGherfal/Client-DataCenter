import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';

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

import Dropdown from 'primevue/dropdown';




// console.log(RouterView)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService);

app.component('Sidebar', Sidebar);
app.component('Button', Button);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.use(ToastService);
app.component('InputText', InputText);
app.component('InputMask', InputMask);
app.component('Card', Card);
app.component('FileUpload', FileUpload);
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);


//------------- Data Table -------------------------
app.component('DataTable', DataTable);
app.component('Column', Column);


app.mount('#app')
