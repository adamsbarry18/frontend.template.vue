import { createApp } from 'vue';
import './assets/style/main.scss';
import App from './App.vue';
import i18n from '@/i18n';
import router from '@/router';
import plugins from './plugins';
import { pinia } from './store';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(pinia);
app.use(plugins);
app.mount('#app');
