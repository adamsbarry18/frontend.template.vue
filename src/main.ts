import { createApp } from 'vue';
import { pinia } from './stores';
import './assets/style/main.scss';
import App from './App.vue';
import i18n from '@/i18n';
import router from '@/router';
import { registerInterceptor } from '@/libs/interceptors/Interceptor';
import plugins from './plugins';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(plugins);

registerInterceptor({ router, i18n });

app.mount('#app');
