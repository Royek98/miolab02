import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Lab02',
      name: 'Lab02', 
      component: () => import('../views/Lab02View.vue')
    },
    {
        // redirect from '/' to '/Lab02' 
        path: '/',
        redirect: "/Lab02"
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404', 
        component: () => import('../views/404View.vue')
    },
    {
      path: '/Lab03',
      name: 'Lab03',
      component: () => import('../views/Lab03View.vue')
    }
  ]
})

export default router
