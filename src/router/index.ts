import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue')
    },

    {
      path: '/customersRecord',
      name: 'CustomersRecord',

      component: () => import('../views/Customers/CustomerRecordView.vue'),   

      children:[
        
        {
        path:'addCustomers',
        props:true,
        component: () => import('../views/Customers/CustomerFormView.vue')
        },
        {
          path:'CustomerProfile/:nameId',
          props:true,
          component: () => import('../components/Customers/CustomerProfile.vue')
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
        },{
          path:'SubscriptionsDetaView',  
          component: () => import('../views/subscriptions/SubscriptionsDataView.vue'),
          }
      ]
    },

    {
      path: '/visitsRecords',
      name: 'VisitsRecords',

      component: () => import('../views/Visits/RecordView.vue'),

      children:[
        {
          path: 'createVisit',
          props:true,
    
          component: () => import('../views/Visits/VisitView.vue')
        },
        {
          path:'vistDetails/:id',
          props:true,
          component: () => import('../components/Visits/VisitDetails.vue')
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
