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
    props: (route) => ({ email: route.params.email }),
    // props: { email: 'email' },
    component: () => import('@/modules//login/_views/LoginExpired.vue'),
    meta: { authenticated: false },
  },
  {
    path: '/forgot-password',
    name: 'password.forgot',
    component: () => import('@/modules/login/_views/PasswordForgot.vue'),
    meta: { authenticated: false },
  },
  {
    path: '/reset-password',
    name: 'password.reset',
    props: (route) => ({
      email: route.params.email,
      token: route.params.token,
    }),
    // props: { email: 'email', token: 'token' },
    component: () => import('@/modules/login/_views/PasswordReset.vue'),
    meta: { authenticated: false },
  },
  {
    path: '/send-email',
    name: 'send.email',
    component: () => import('@/modules/login/_views/SendEmail.vue'),
    meta: { authenticated: false },
  },
];

export default loginRoutes;
