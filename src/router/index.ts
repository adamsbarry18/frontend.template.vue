import {
  createRouter,
  isNavigationFailure,
  NavigationFailureType,
  RouteRecordRaw,
  RouteLocationNormalized,
  createWebHashHistory,
} from 'vue-router';
import i18n from '@/i18n';
import loginRoutes from './login.routes';
import administrationRoutes from './administration.routes';
import testRoutes from './test.routes';
import { useUsersStore } from '@/stores/modules/users/user';
import { useNavStore } from '@/stores/modules/menu/nav';
import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';
import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
import { UMessage } from '@/modules/ui';

declare module 'vue-router' {
  interface RouteMeta {
    authenticated?: boolean;
    guest?: boolean;
    breadcrumb?: { label: string; path?: string }[];
    authorisation?: {
      level?: number;
      feature?: string;
      action?: string;
      onlyInternal?: boolean;
      allowInternal?: boolean;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/modules/dashboard/_views/Dashboard.vue'),
    meta: {
      breadcrumb: [{ label: 'dashboard' }],
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/modules/not-found/_views/404.vue'),
    meta: { guest: true },
  },
  ...loginRoutes,
  ...testRoutes,
  ...administrationRoutes,
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
  history: createWebHashHistory(),
  routes,
});

/**
 * Handles non-critical navigation errors (duplicates, cancellations).
 */
function handleNavigationError(err: any) {
  if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
    console.info('Navigation duplicated:', err.to.path);
  } else if (isNavigationFailure(err, NavigationFailureType.cancelled)) {
    console.info('Navigation cancelled.');
  } else if (isNavigationFailure(err, NavigationFailureType.aborted)) {
    console.info('Navigation aborted.');
  } else {
    console.error('Navigation error:', err);
  }
}

const originalPush = router.push;
router.push = (location) => {
  return originalPush.call(router, location).catch(handleNavigationError);
};

const originalReplace = router.replace;
router.replace = (location) => {
  return originalReplace.call(router, location).catch(handleNavigationError);
};

function updateBreadcrumb(to: RouteLocationNormalized) {
  const breadcrumbStore = useBreadcrumbStore();
  const links = to.meta.breadcrumb
    ? to.meta.breadcrumb.map((l) => ({
        path: l.path || '',
        label: i18n.global.t(`breadcrumb.${l.label}`),
      }))
    : [];
  breadcrumbStore.setBreadcrumb(links, null);
}

router.beforeEach(async (to, from, next) => {
  const usersStore = useUsersStore();
  const navStore = useNavStore();
  const authorisationsStore = useAuthorisationsStore();

  if (from.name !== to.name) {
    updateBreadcrumb(to);
  }
  navStore.setCurrentItem(to.name as string);

  // Traitement spécifique pour la confirmation de changement de mot de passe
  // L'URL générée par le backend est maintenant /#/confirm-password?code=CODE
  if (to.path === '/confirm-password' && to.query.code) {
    try {
      await usersStore.passwordConfirm({ code: to.query.code as string });
      UMessage({
        type: 'success',
        message: i18n.global.t('login.password_confirmed'),
      });
      next({ name: 'login', replace: true, query: {} });
    } catch (error) {
      console.error('Password confirmation failed:', error);
      UMessage({ type: 'error', message: i18n.global.t('error.generic') });
      next({ name: 'login', replace: true, query: {} });
    }
    return;
  }

  if (!usersStore.authStatusChecked) {
    await usersStore.initializeAuth();
  }

  const isAuthenticated = usersStore.isAuthenticated;
  const requiresGuest = to.meta.guest === true;
  const requiresAuth = !requiresGuest;

  if (requiresAuth && !isAuthenticated) {
    console.log(`Redirecting to login. Target: ${to.fullPath}`);
    next({ name: 'login', query: { redirect: to.fullPath }, replace: true });
  } else if (requiresGuest && isAuthenticated) {
    console.log('Redirecting authenticated user to dashboard from guest route.');
    next({ name: 'dashboard', replace: true });
  } else if (requiresAuth && isAuthenticated && to.meta.authorisation) {
    const authMeta = to.meta.authorisation;
    let isAuthorized = false;

    if (authMeta.allowInternal && usersStore.internal) {
      isAuthorized = true;
    } else if (authMeta.onlyInternal && !usersStore.internal) {
      isAuthorized = false;
    } else {
      if (authMeta.level !== undefined) {
        isAuthorized = authorisationsStore.level >= authMeta.level;
      }
      if (isAuthorized && authMeta.feature && authMeta.action) {
        isAuthorized = authorisationsStore.isUserAllowed(authMeta.feature, authMeta.action);
      } else if (!authMeta.level && authMeta.feature && authMeta.action) {
        isAuthorized = authorisationsStore.isUserAllowed(authMeta.feature, authMeta.action);
      }
    }

    if (!isAuthorized) {
      console.warn(`Authorization failed for user to access ${to.path}`);
      UMessage({
        type: 'error',
        showClose: true,
        message: i18n.global.t('error.view-not-allowed'),
      });
      next({ name: 'dashboard', replace: true });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
