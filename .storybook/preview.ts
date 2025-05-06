// preview.ts
import { setup } from '@storybook/vue3';
import { createApp } from 'vue';
import type { Preview } from '@storybook/vue3';
import { vueRouter } from 'storybook-vue3-router';
import i18n from '@/i18n';
import './style.scss';
import '../src/assets/style/main.scss';
import plugins from '@/plugins';

const app = createApp({});
app.config.globalProperties.$t = (key: string, ...args: any[]) => i18n.global.t(key, args);

// Installation globale de i18n
setup((app) => {
  app.use(i18n);
  app.use(plugins);
});

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'fr-FR',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en-US', right: '🇬🇧', title: 'English' },
        { value: 'fr-FR', right: '🇫🇷', title: 'Français' },
      ],
    },
  },
};

const withI18n = (Story, context) => {
  i18n.global.locale = context.globals.locale;
  return Story();
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withI18n, vueRouter()],
  globalTypes,
  tags: ['autodocs'],
};

export default preview;
