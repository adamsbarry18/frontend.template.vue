import { useAuthorisationsStore } from '@/stores/modules/authorisations/authorisations';
import type { App, DirectiveBinding } from 'vue';

export default {
  install: (app: App) => {
    app.directive('has-authorisation', {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        const authorisationsStore = useAuthorisationsStore();
        const [feature, action] = (binding.value as string)?.split('.') ?? [];

        if (!feature || !action) {
          console.warn(
            'v-has-authorisation directive requires a value like "feature.action"'
          );
          el.style.display = 'none';
          return;
        }

        if (!authorisationsStore.isUserAllowed(feature, action)) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement, binding: DirectiveBinding) {
        const authorisationsStore = useAuthorisationsStore();
        const [feature, action] = (binding.value as string)?.split('.') ?? [];

        if (!feature || !action) {
          console.warn(
            'v-has-authorisation directive requires a value like "feature.action"'
          );
          el.style.display = 'none';
          return;
        }

        if (!authorisationsStore.isUserAllowed(feature, action)) {
          el.style.display = 'none';
        }
      },
    });

    app.directive('is-integrator', {
      mounted(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isIntegrator) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isIntegrator) {
          el.style.display = 'none';
        }
      },
    });
  },
};
