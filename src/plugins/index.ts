import install from './install';
import vcharts from './vcharts';

import type { App, Plugin } from 'vue';

const plugins: Plugin = {
  install: (app: App) => {
    app.use(install);
    app.use(vcharts);
  },
};

export default plugins;
