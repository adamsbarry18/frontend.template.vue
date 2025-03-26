import { ElNotification } from 'element-plus';
import { getCssVariable } from './Style';
import { useNotificationStore } from '@/modules/shared/skeleton/notification/_store/notification';

export const DISPLAY_TYPE = {
  PERSISTENT: 'persistent',
  PERSISTENT_SHORT: 'persistent_short',
  SHORT: 'short',
} as const;
export type DisplayType = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

interface ShortLivedParams {
  title: string;
  message: string;
  type?: string;
  duration?: number;
}

interface PersistentOptions {
  context?: any;
  isError?: boolean;
  icon?: string;
}

interface NotifyParams extends ShortLivedParams {
  template?: string;
  display?: DisplayType;
  duration?: number;
  options?: PersistentOptions;
}

export default class RootNotification {
  static shortLivedNotify({
    title,
    message,
    type = '',
    duration = 4500,
  }: ShortLivedParams): void {
    const stonlyTopBannerHeight = parseInt(
      getCssVariable('--stonly-banner-top-sticky-margin') ||
        getCssVariable('--stonly-banner-top-margin') ||
        '0',
      10
    );
    ElNotification({
      title,
      message,
      type,
      duration,
      offset: 60 + stonlyTopBannerHeight,
    } as any);
  }

  static persistentNotify(
    template: string,
    options: PersistentOptions = {}
  ): void {
    const notificationStore = useNotificationStore();
    notificationStore.addPersistentNotification({
      template,
      context: options.context,
      icon: options.icon || 'icon-notif-active',
      isError: options.isError || false,
    });
  }

  /**
   * Affiche une notification.
   *
   * @param {string} title - Le titre de la notification
   * @param {string} message - Le message de la notification
   * @param {string} type - Le type (success, warning, info, error)
   * @param {string} template - Le template de notification (DOM)
   * @param {DisplayType} display - Type d'affichage (voir DISPLAY_TYPE)
   * @param {number} duration - Durée d'affichage
   * @param {PersistentOptions} options - Options supplémentaires
   */
  static notify({
    title,
    message,
    type = '',
    template,
    display = DISPLAY_TYPE.SHORT,
    duration = 4500,
    options,
  }: NotifyParams): void {
    if (
      display === DISPLAY_TYPE.SHORT ||
      display === DISPLAY_TYPE.PERSISTENT_SHORT
    ) {
      if (!title) {
        throw new Error('short notify required title');
      }
      this.shortLivedNotify({ title, message, type, duration });
    }

    if (
      display === DISPLAY_TYPE.PERSISTENT ||
      display === DISPLAY_TYPE.PERSISTENT_SHORT
    ) {
      if (!template) {
        this.persistentNotify(
          `<div>
            <div class='root-notif-title'>${title}</div>
            <div class='root-notif-content'>${message}</div>
          </div>`,
          options
        );
      } else {
        this.persistentNotify(template, options);
      }
    }

    if (!Object.values(DISPLAY_TYPE).includes(display)) {
      throw new Error(
        'display is not equal to: ' + Object.keys(DISPLAY_TYPE).toString()
      );
    }
  }

  static success({
    title,
    message,
    template,
    display,
    duration = 4500,
    options,
  }: NotifyParams): void {
    this.notify({
      title,
      message,
      type: 'success',
      template,
      display,
      duration,
      options,
    });
  }

  static warning({
    title,
    message,
    template,
    display,
    duration = 4500,
    options,
  }: NotifyParams): void {
    this.notify({
      title,
      message,
      type: 'warning',
      template,
      display,
      duration,
      options,
    });
  }

  static info({
    title,
    message,
    template,
    display,
    duration = 4500,
    options,
  }: NotifyParams): void {
    this.notify({
      title,
      message,
      type: 'info',
      template,
      display,
      duration,
      options,
    });
  }

  static error({
    title,
    message,
    template,
    display,
    duration = 4500,
    options,
  }: NotifyParams): void {
    this.notify({
      title,
      message,
      type: 'error',
      template,
      display,
      duration,
      options: { ...options, isError: true },
    });
  }
}
