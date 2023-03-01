import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartInfo from '@/components/InfoPage/ChartInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/ChartInfo',
      name: 'home',
      component: ChartInfo
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
    }
  ]
})

export default router
