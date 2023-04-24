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
    // ,
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
