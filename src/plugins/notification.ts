import type { App } from 'vue';
import 'animate.css';
import RootNotification from '@/libs/utils/Notification';
import '@/assets/style/notification.scss';

export const notification = RootNotification;

export default {
  install(app: App) {
    app.config.globalProperties.$notfication = notification;
  },
};
