import { App } from 'vue';
import { ElLoading, ElInfiniteScroll } from 'element-plus';
import langFr from 'element-plus/es/locale/lang/fr';
import langEn from 'element-plus/es/locale/lang/en';
import locale from 'element-plus/es/locale';

import icones from '@/commons/icones';
import AConfirm from '@/modules/notice/AConfirm';
import APrompt from '@/modules/notice/APrompt';
import AMessage from '@/modules/notice/AMessage';
import AMessageBox from '@/modules/notice/AMessageBox';
import { numberFormat } from '@/libs/utils/Number';

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
    app.config.globalProperties.$ELEMENT = { size: 'small' };
    app.config.globalProperties.$loading = ElLoading.service;
    app.use(ElLoading);
    app.use(ElInfiniteScroll);
    app.config.globalProperties.$confirm = AConfirm;
    app.config.globalProperties.$message = AMessage;
    app.config.globalProperties.$nFormat = numberFormat;

    app.config.globalProperties.$errorMsg = (message: string) => {
      AMessage({
        type: 'error',
        message,
      });
    };

    app.config.globalProperties.$successMsg = (message: string) => {
      AMessage({
        type: 'success',
        message,
      });
    };

    app.config.globalProperties.$prompt = APrompt;
    app.config.globalProperties.$msgbox = AMessageBox;

    Object.entries(icons).forEach(([key, component]) => {
      const snakeCaseName = key
        .replace(/\.?(\w)/g, (_, y) => `-${y.toLowerCase()}`)
        .replace(/^-/, '');
      app.component(snakeCaseName, component);
    });

    if (options.i18n) {
      appInstance.i18n = options.i18n;
      appInstance.i18n.mergeLocaleMessage('en', langEn);
      appInstance.i18n.mergeLocaleMessage('fr', langFr);
      locale.use(appInstance.i18n.locale);
    } else {
      locale.use(langEn);
    }

    if (options.userStorage) {
      appInstance.userStorage = options.userStorage;
    }

    if (options.trackEvent) {
      appInstance.trackEvent = options.trackEvent;
    }
  },
};
