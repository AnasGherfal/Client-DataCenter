import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css' 
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.component('Sidebar', Sidebar);
app.component('Button', Button);
app.component('Menu', Menu);
app.component('Menubar', Menubar);


app.mount('#app')
