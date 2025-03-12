import * as icons from '@/commons/icons';

import { ElLoading, ElInfiniteScroll } from 'element-plus';

import fr from 'element-plus/es/locale/lang/fr';
import en from 'element-plus/es/locale/lang/en';

import type { App } from 'vue';
import type { I18n } from 'vue-i18n';

interface AppInstance {
  i18n: I18n | null;
  userStorage: Storage;
  trackEvent: ((...args: any[]) => void) | null;
}

interface InstallOptions {
  i18n?: I18n;
  userStorage?: Storage;
  trackEvent?: (...args: any[]) => void;
}

export const appInstance: AppInstance = {
  i18n: null,
  userStorage: window.localStorage,
  trackEvent: null,
};

export default {
  install: (app: App, options: InstallOptions = {}) => {
    app.config.globalProperties.$ELEMENT = { size: 'small' };

    app.use(ElLoading);
    // app.directive('loading', ElLoading.directive);
    app.directive('infinite-scroll', ElInfiniteScroll);

    // Enregistrement des composants d'icônes
    Object.keys(icons).forEach((key) => {
      const snakeCaseName = key
        .replace(/\.?([A-Z])/g, (x, y) => `-${y.toLowerCase()}`)
        .replace(/^-/, '');
      app.component(snakeCaseName, icons[key]);
    });

    if (options.i18n) {
      appInstance.i18n = options.i18n;
      appInstance.i18n.global.mergeLocaleMessage('en', en);
      appInstance.i18n.global.mergeLocaleMessage('fr', fr);
    }

    if (options.userStorage) {
      appInstance.userStorage = options.userStorage;
    }

    if (options.trackEvent) {
      appInstance.trackEvent = options.trackEvent;
    }
  },
};
