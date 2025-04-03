import global from './global';
import vcharts from './vcharts';
import reactBus from './reactBus';
import shortcutManager from './shortcutManager';
import role from './role';
import hasAuthorizationDirectives from './has-authorization-directives';
import './oauthCookie';

import type { App, Plugin } from 'vue';

const plugins: Plugin = {
  install: (app: App) => {
    app.use(global);
    app.use(vcharts);
    app.use(reactBus);
    app.use(shortcutManager);
    app.use(role);
    app.use(hasAuthorizationDirectives);
  },
};

export default plugins;
