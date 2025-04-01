import { App } from 'vue';
import { ElLoading, ElInfiniteScroll } from 'element-plus';
import * as icons from '@/modules/common/icons';

function registerGlobalComponents(app: App) {
  Object.keys(icons).forEach((key) => {
    const snakeCaseName = key
      .replace(/\.?([A-Z])/g, (x, y) => `-${y.toLowerCase()}`)
      .replace(/^-/, '');
    app.component(snakeCaseName, icons[key]);
  });
}

function registerDirectives(app: App) {
  app.use(ElLoading);
  app.directive('infinite-scroll', ElInfiniteScroll);
}

export default {
  install: (app: App) => {
    // Configuration globale d'Element Plus
    app.config.globalProperties.$ELEMENT = { size: 'small' };

    // Enregistrement des composants et directives
    registerGlobalComponents(app);
    registerDirectives(app);
  },
};
