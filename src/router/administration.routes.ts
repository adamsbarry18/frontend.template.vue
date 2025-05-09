import { SecurityLevel } from '@/stores/modules/users/models/UserModel';
import { RouteRecordRaw } from 'vue-router';

const administrationRoutes: RouteRecordRaw[] = [
  {
    path: '/account/settings',
    name: 'user-settings-edit',
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'user-edit' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/modules/users/_views/Users.vue'),
    meta: {
      breadcrumb: [{ label: 'admin.users' }],
      authorisation: {
        level: SecurityLevel.ADMIN,
      },
    },
  },
  {
    path: '/users/settings/:id(\\d+)',
    name: 'admin-user-settings-edit',
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: (route) => ({ mode: 'admin-edit', id: Number(route.params.id) }),
    meta: {
      authorisation: {
        level: SecurityLevel.ADMIN,
      },
    },
  },
  {
    path: '/users/new',
    name: 'user-settings-creation',
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'creation' },
    meta: {
      authorisation: {
        level: SecurityLevel.ADMIN,
      },
    },
  },
];

export default administrationRoutes;
