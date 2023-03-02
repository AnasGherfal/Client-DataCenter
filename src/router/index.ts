import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartInfo from '@/components/InfoPage/ChartInfo.vue'

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

      component: () => import('../views/Users/UsersView.vue')
    },
    {
      path: '/UsersRecord',
      name: 'UsersRecord',

      component: () => import('../views/Users/UsersRecordView.vue')
    },
    {
      path: '/CreateVisit',
      name: 'NewVisit',

      component: () => import('../views/Visits/VisitView.vue')
    },
    {
      path: '/VisitsRecords',
      name: 'VisitsRecords',

      component: () => import('../views/Visits/RecordView.vue')
    },
  ]
})

export default router
