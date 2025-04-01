import { RouteRecordRaw } from 'vue-router';

const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/login/_views/Login.vue'),
    meta: { authenticated: false },
  },
  {
    path: '/login-expired',
    name: 'login.expired',
    props: { email: 'email' },
    component: () => import('@/modules//login/_views/LoginExpired.vue'),
    meta: {
      authenticated: false,
    },
  },
];

export default loginRoutes;
