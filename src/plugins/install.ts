import { App } from 'vue';
import { ElLoading, ElInfiniteScroll } from 'element-plus';
import langFr from 'element-plus/es/locale/lang/fr';
import langEn from 'element-plus/es/locale/lang/en';
import locale from 'element-plus/es/locale';

import * as icons from '@/commons/icons';
import UConfirm from '@/commons/notice/UConfirm';
import UPrompt from '@/commons/notice/UPrompt';
import UMessage from '@/commons/notice/UMessage';
import UMessageBox from '@/commons/notice/UMessageBox';
import { useNumbers } from '@/composabes/useNumbers';

interface AppInstance {
  i18n: any | null;
  userStorage: Storage;
  trackEvent: ((event: string, data?: any) => void) | null;
}

export const appInstance: AppInstance = {
  i18n: null,
  userStorage: window.localStorage,
  trackEvent: null,
};

export default {
  install: (
    app: App,
    options: {
      i18n?: any;
      userStorage?: Storage;
      trackEvent?: (event: string, data?: any) => void;
    } = {}
  ) => {
    const numberFormat = useNumbers();
    app.config.globalProperties.$ELEMENT = { size: 'small' };
    app.config.globalProperties.$loading = ElLoading.service;
    app.use(ElLoading);
    app.use(ElInfiniteScroll);
    app.config.globalProperties.$confirm = UConfirm;
    app.config.globalProperties.$message = UMessage;
    app.config.globalProperties.$nFormat = numberFormat;

    app.config.globalProperties.$errorMsg = (message: string) => {
      UMessage({
        type: 'error',
        message,
      });
    };

    app.config.globalProperties.$successMsg = (message: string) => {
      UMessage({
        type: 'success',
        message,
      });
    };

    app.config.globalProperties.$prompt = UPrompt;
    app.config.globalProperties.$msgbox = UMessageBox;

    // Enregistrement global des icônes
    Object.entries(icons).forEach(([key, component]) => {
      // Ignorer l'export default global
      if (key === 'default') return;

      // Convert PascalCase to kebab-case
      const kebabCaseName = key
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      app.component(kebabCaseName, component);
      app.component(key, component); // Register with original name
    });

    if (options.i18n) {
      appInstance.i18n = options.i18n;
      appInstance.i18n.mergeLocaleMessage('en', langEn);
      appInstance.i18n.mergeLocaleMessage('fr', langFr);
      (locale as any).i18n((key, value) => appInstance.i18n.t(key, value));
    } else {
      // Fallback: return the key if no i18n instance is provided
      (locale as any).i18n((key) => key);
    }

    if (options.userStorage) {
      appInstance.userStorage = options.userStorage;
    }

    if (options.trackEvent) {
      appInstance.trackEvent = options.trackEvent;
    }
  },
};
