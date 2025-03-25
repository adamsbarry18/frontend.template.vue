import install from './install';
import vcharts from './vcharts';
import reactBus from './reactBus';

import type { App, Plugin } from 'vue';

const plugins: Plugin = {
  install: (app: App) => {
    app.use(install);
    app.use(vcharts);
    app.use(reactBus);
  },
};

export default plugins;
