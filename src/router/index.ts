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
      path: '/settings',
      name: 'settings',
      component: MyHome,
    },
    {
      path: '/users-1',
      name: 'users',
      component: MyHome,
    },
    {
      path: '/store-1',
      name: 'store',
      component: MyHome,
    },
    {
      path: '/product-1',
      name: 'product',
      component: MyHome,
    },
    {
      path: '/travel-1',
      name: 'travel',
      component: MyHome,
    },
    {
      path: '/kitchen-1',
      name: 'kitchen',
      component: MyHome,
    },
    {
      path: '/preferences-1',
      name: 'preferences',
      component: MyHome,
    },
  ],
});

export default router;
