import {
  createRouter,
  createWebHistory,
  isNavigationFailure,
  NavigationFailureType,
  RouteRecordRaw,
} from 'vue-router';
import i18n from '@/i18n';
import loginRoutes from './login.routes';
import { useUsersStore } from '@/stores/users/user';
import { useNavStore } from '@/stores/menu/nav';
import testRoutes from './test.routes';
import administationRoutes from './administration.routes';
// import { useBreadcrumbStore } from '@/stores/breadcrumb';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/modules/dashboard/_views/Dashboard.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/modules/not-found/_views/404.vue'),
    meta: { authenticated: false },
  },
  ...loginRoutes,
  ...testRoutes,
  ...administationRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Gère les erreurs de navigation non critiques
 */
function NavigationErrorHandler(err: any) {
  if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
    console.info('Navigation duplicated', err);
  } else if (isNavigationFailure(err, NavigationFailureType.cancelled)) {
    console.info('Navigation cancelled', err);
  } else if (isNavigationFailure(err, NavigationFailureType.aborted)) {
    console.info('Navigation aborted', err);
  } else {
    throw err;
  }
}

// Remplacement de push et replace pour intercepter les erreurs de navigation
const originalPush = router.push;
router.push = ((location) => {
  return originalPush.call(router, location).catch(NavigationErrorHandler);
}) as typeof router.push;

const originalReplace = router.replace;
router.replace = ((location) => {
  return originalReplace.call(router, location).catch(NavigationErrorHandler);
}) as typeof router.replace;

// Exemple de fonction pour réinitialiser le breadcrumb
// (Adaptez-la selon votre store de breadcrumb)
function resetBreadcrumb(to) {
  const links = to.meta.breadcrumb
    ? to.meta.breadcrumb.map((l) => ({
        path: l.path,
        label: i18n.global.t(`breadcrumb.${l.label}`),
      }))
    : [];
  // Si vous utilisez Pinia pour le breadcrumb, appelez ici une action
  // useBreadcrumbStore().setBreadcrumb({ links });
}

/* Guard global */
router.beforeEach(async (to, from, next) => {
  const usersStore = useUsersStore();
  const navStore = useNavStore();
  if (from.name !== to.name) {
    resetBreadcrumb(to);
  }
  navStore.setCurrentItem(to.name as string);

  // Si la route contient "confirm_pwd" dans la query, appeler passwordConfirm
  if (to.query.confirm_pwd) {
    // await usersStore.passwordConfirm({ code: to.query.confirm_pwd as string });
    next({ name: 'login', params: { updatePassword: 'success' } });
    return;
  }

  // Si la route contient "reset_pwd" dans la query, rediriger vers password.reset
  if (to.query.reset_pwd) {
    next({
      name: 'password.reset',
      params: { email: to.query.email, token: to.query.reset_pwd },
    });
    return;
  }
  next();
});

export default router;
