import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router';
import { action } from '@storybook/addon-actions';
import { defineComponent } from 'vue';

const StoryRouter =
  (links = {}, routerProps: any = {}) =>
  (story: any) => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
      ...routerProps,
    });

    if (routerProps.initialEntry) {
      router.replace(routerProps.initialEntry);
    } else {
      router.replace('/');
    }

    const getLocation = (location: RouteLocationRaw) => {
      // The localtion can be a simple string if you are using directly one of the
      // Router methods (https://router.vuejs.org/en/api/router-instance.html#methods)
      // or it can be an object, having the name or the path depending if you
      // are using named routes or not.
      if (typeof location === 'object') {
        if ('path' in location && location.path) {
          return location.path;
        } else if ('name' in location && location.name) {
          return `name: ${String(location.name)}`; // Ensure name is stringified
        }
        return JSON.stringify(location); // Fallback for other object types
      }
      return location;
    };

    let replaced: boolean = false;

    // We want to log every action performed on the navigation router with the only
    // exception of links replaced with the linkTo callback.
    // Unfortunately VueRouter does not perform any action if the target route is
    // the same of the current one (see the code at the url https://goo.gl/gGVxzq).
    // Replacing the original push / replace router methods workaround the issue
    // with the assumption that the afterEach global guard is called from those
    // methods.
    const originalPush = router.push.bind(router);

    router.push = (location: RouteLocationRaw) => {
      replaced = false;
      return originalPush(location)
        .catch(() => {})
        .finally(() => {
          if (!replaced) {
            action('PUSH')(getLocation(location));
          }
        });
    };

    const originalReplace = router.replace.bind(router);

    router.replace = (location: RouteLocationRaw) => {
      replaced = false;
      return originalReplace(location)
        .catch(() => {})
        .finally(() => {
          if (!replaced) {
            action('REPLACE')(getLocation(location));
          }
        });
    };

    if (routerProps.globalBeforeEach) {
      router.beforeEach(routerProps.globalBeforeEach);
    }

    router.afterEach((to) => {
      for (const link of Object.keys(links)) {
        if (to.fullPath === link) {
          (links as any)[link](to.fullPath);
          replaced = true;
          return;
        }
      }
    });

    const WrappedComponent = story();
    return defineComponent({
      components: { WrappedComponent },
      template: '<WrappedComponent />',
      setup() {
        const routerInstance = router;
        return { router: routerInstance };
      },
      beforeUnmount() {
        // Réinitialisation des hooks
        router.afterEach(() => {});
      },
    });
  };

export default StoryRouter;
