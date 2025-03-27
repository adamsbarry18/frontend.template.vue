import Dashboard from '@/modules/dashboard/_views/Dashboard.vue';
import MyHome from '@/views/MyHome.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/my-account',
      name: 'my-account',
      component: MyHome,
    },
    {
      path: '/account',
      name: 'account',
      component: MyHome,
    },
    {
      path: '/logout',
      name: 'logout',
      component: MyHome,
    },
    {
      path: '/user-settings',
      name: 'user-settings',
      component: MyHome,
    },
    {
      path: '/users',
      name: 'users',
      component: MyHome,
    },
    {
      path: '/menu-phone',
      name: 'menu-phone',
      component: MyHome,
    },
    {
      path: '/profile-search',
      name: 'profile-search',
      component: MyHome,
    },
  ],
});

export default router;
