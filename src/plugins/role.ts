import { useAuthorisationsStore } from '@/stores/modules/auth/authorisations';
import type { App } from 'vue';

export default {
  install: (app: App) => {
    app.directive('is-admin', {
      mounted(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isAdmin) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isAdmin) {
          el.style.display = 'none';
        }
      },
    });

    app.directive('is-user', {
      mounted(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isUser) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement) {
        const authorisationsStore = useAuthorisationsStore();
        if (!authorisationsStore.isUser) {
          el.style.display = 'none';
        }
      },
    });
  },
};
