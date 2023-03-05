import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartInfo from '@/components/InfoPage/ChartInfo.vue'
import AddService from '@/components/Services/AddService.vue'
import Addpackages from '@/components/Services/Addpackages.vue'
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
      path: '/users',
      name: 'users',

      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/UsersRecord',
      name: 'UsersRecord',

      component: () => import('../views/Users/UsersRecordView.vue')
    },
    {
      path: '/AddService',
      name: 'AddService',

      component: () => import('../components/Services/AddService.vue')
    },
    {
      path: '/Addpackages',
      name: 'Addpackages',

      component: () => import('../components/Services/Addpackages.vue')
    }
  ]
})

export default router
