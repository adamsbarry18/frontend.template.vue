import global from './global';
import vcharts from './vcharts';
import reactBus from './reactBus';
import shortcutManager from './shortcutManager';

import type { App, Plugin } from 'vue';

const plugins: Plugin = {
  install: (app: App) => {
    app.use(global);
    app.use(vcharts);
    app.use(reactBus);
    app.use(shortcutManager);
  },
};

export default plugins;
