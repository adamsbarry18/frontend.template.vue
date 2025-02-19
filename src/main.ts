import { createApp } from 'vue';
import './assets/style/main.scss';
import App from './App.vue';
import i18n from '@/i18n';

const app = createApp(App);
app.use(i18n);

app.mount('#app');
