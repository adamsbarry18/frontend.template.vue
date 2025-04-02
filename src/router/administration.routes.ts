import { RouteRecordRaw } from 'vue-router';

const administationRoutes: RouteRecordRaw[] = [
  {
    path: '/users/my-account',
    name: 'my-account',
    meta: {
      breadcrumb: [{ path: '', label: 'my-account' }],
    },
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'user-edit' },
  },
  {
    path: '/users',
    name: 'users',
    meta: {
      breadcrumb: [{ path: '', label: 'admin.users' }],
      authorisation: {
        level: 5,
      },
    },
    component: () => import('@/modules/users/_views/Users.vue'),
  },
  {
    path: '/users/settings/:id',
    name: 'user-settings',
    meta: {
      breadcrumb: [{ path: '', label: 'admin.users' }],
      changedState: 'users',
      authorisation: {
        level: 5,
      },
    },
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'admin-edit' },
  },
  {
    path: '/users/new-user',
    name: 'new-user',
    meta: {
      breadcrumb: [{ path: '', label: 'admin.users' }],
      changedState: 'users',
      authorisation: {
        level: 5,
      },
    },
    component: () => import('@/modules/users/_views/UserSettings.vue'),
    props: { mode: 'creation' },
  },
];

export default administationRoutes;
