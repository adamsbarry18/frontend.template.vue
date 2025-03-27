import * as icons from '@/modules/common/icons';

import { ElLoading, ElInfiniteScroll } from 'element-plus';
import uConfirm from '@/modules/common/notice/UConfirm';
import uMessage from '@/modules/common/notice/UMessage';
import uMessageBox from '@/modules/common/notice/UMessageBox';
import uPrompt from '@/modules/common/notice/UPrompt';

import fr from 'element-plus/es/locale/lang/fr';
import en from 'element-plus/es/locale/lang/en';

import type { App } from 'vue';
import type { I18n } from 'vue-i18n';

interface AppInstance {
  i18n: I18n | null;
  userStorage: Storage;
}

interface InstallOptions {
  i18n?: I18n;
  userStorage?: Storage;
}

export const appInstance: AppInstance = {
  i18n: null,
  userStorage: window.localStorage,
};

export const confirm = uConfirm;
export const message = uMessage;
export const prompt = uPrompt;
export const msgbox = uMessageBox;

export default {
  install: (app: App, options: InstallOptions = {}) => {
    app.config.globalProperties.$ELEMENT = { size: 'small' };

    app.config.globalProperties.$confirm = confirm;
    app.config.globalProperties.$message = message;

    app.config.globalProperties.$errorMsg = (message) => {
      uMessage({
        type: 'error',
        message,
      });
    };
    app.config.globalProperties.$successMsg = (message) => {
      uMessage({
        type: 'success',
        message,
      });
    };

    app.config.globalProperties.$prompt = prompt;
    app.config.globalProperties.$msbox = msgbox;

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
  },
};
