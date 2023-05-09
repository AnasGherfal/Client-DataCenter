import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/MainPage/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import UserRecordsVue from '@/views/Users Mangment/UserRecords.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/UsersRecord',
      name: 'UsersRecord',
      component: () => import('../views/Users Mangment/UserRecords.vue'),
      children:[
        
        {
        path:'AddUser',
        props:true,
        component: () => import('../views/Users Mangment/AddUser.vue')
        },
        {
          path:'UsersProfile/:id',
          props:true,
          component: () => import('../views/Users Mangment/Profile.vue')
          },
      ]
    },
    {
      path: '/Login',
      name: 'loginPage',
      component: () => import('../views/LoginPage.vue'),

    },

    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    },

    {
      path: '/customersRecord',
      name: 'CustomersRecord',

      component: () => import('../views/Customers/CustomersRecord.vue'),  

      children:[
        
        {
        path:'addCustomer',
        props:true,
        component: () => import('../views/Customers/AddCustomer.vue')
        },
        {
          path:'CustomerProfile/:id',
          props:true,
          component: () => import('../views/Customers/Profile/CustomerProfile.vue')
        }
      ]
      
    },
    {
      path: '/subscriptionsRecord',
      name: 'SubscriptionsRecord',

      component: () => import('../views/subscriptions/SubscriptionsRecordView.vue'),

      children:[
        {
        path:'addSubsciptions',  
        component: () => import('../views/subscriptions/AddsubscriptionsView.vue'),
        },
        {
          path:'SubscriptionsDetaView/:nad', 
          props:true, 
          component: () => import('../views/subscriptions/SubscriptionsDataView.vue'),
          }
      ]
    },

    {
      path: '/visitsRecords',
      name: 'VisitsRecords',

      component: () => import('../views/Visits/VisitsRecord.vue'),

      children:[
        {
          path: 'createVisit',
          props:true,
    
          component: () => import('../views/Visits/VisitForm.vue')
        },
        {
          path:'vistDetails/:id',
          props:true,
          component: () => import('../views/Visits/VisitDetailsView.vue')
        }
      ]
    },
    {
      path: '/settingsView',
      name: 'SettingsView',

      component: () => import('../views/Settings/SettingsView.vue')
    },
    {
      path: '/adminProfile',
      name: 'AdminProfile',

      component: () => import('../views/AdminProfile/adminProfileView.vue')
    },
    {
      path:'/invoices',
      name: 'Invoices',
      component:() => import('../views/Invoices/InvoicesView.vue'),
      children:[
        {
          path:'invoicesDetails',
          props:true,
          component:() => import('../views/Invoices/InvoicesDetailsView.vue')
        },
    ]
    }
  ]
})

export default router
