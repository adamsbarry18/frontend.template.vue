import mitt from 'mitt';
import type { App } from 'vue';

export const STATE = {
  TEST_NOTIFICATION: 'TEST_NOTIFICATION',
};

export const reactBus = mitt();

export default {
  install(app: App) {
    app.config.globalProperties.$reactBus = reactBus;
  },
};
