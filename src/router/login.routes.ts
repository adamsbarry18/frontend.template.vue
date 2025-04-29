import { RouteRecordRaw } from 'vue-router';

const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/login/_views/Login.vue'),
    // Remplacé authenticated: false par guest: true
    meta: { guest: true },
  },
  {
    path: '/login-expired',
    name: 'login.expired',
    // Note: Les props ici semblent être des placeholders, la logique réelle
    // pour passer des données à ce composant pourrait être différente (ex: query params, state).
    // props: { email: 'email' }, // Commenté car l'utilisation de props statiques comme ceci est inhabituelle.
    component: () => import('@/modules/login/_views/LoginExpired.vue'),
    // Remplacé authenticated: false par guest: true
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'password.forgot',
    component: () => import('@/modules/login/_views/PasswordForgot.vue'),
    // Remplacé authenticated: false par guest: true
    meta: { guest: true },
  },
  {
    path: '/reset-password/:email/:token', // Utilisation de paramètres de route pour email et token
    name: 'password.reset',
    // Les props sont automatiquement passées depuis les params si true
    props: true,
    component: () => import('@/modules/login/_views/PasswordReset.vue'),
    // Remplacé authenticated: false par guest: true
    meta: { guest: true },
  },
  {
    path: '/send-email', // Renommé pour clarifier (ex: password-reset-sent) ? Ou garder si générique.
    name: 'send.email', // Nom à clarifier potentiellement (ex: 'password.reset.sent')
    component: () => import('@/modules/login/_views/SendEmail.vue'),
    // Remplacé authenticated: false par guest: true
    meta: { guest: true },
  },
];

export default loginRoutes;
