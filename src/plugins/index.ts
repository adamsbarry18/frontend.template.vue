import install from './install';
import vcharts from './vcharts';
import reactBus from './reactBus';
import notification from './notification';

import type { App, Plugin } from 'vue';

const plugins: Plugin = {
  install: (app: App) => {
    app.use(install);
    app.use(vcharts);
    app.use(reactBus);
    app.use(notification);
  },
};

export default plugins;
