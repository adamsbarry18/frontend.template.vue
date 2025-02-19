// preview.ts
import { setup } from '@storybook/vue3';
import type { Preview } from '@storybook/vue3';
import 'element-plus/dist/index.css';
import i18n from '@/i18n';
import '../src/assets/style/main.scss';
import './style.scss';

// Installation globale de i18n
setup((app) => {
  app.use(i18n);
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
  decorators: [withI18n],
  globalTypes,
  tags: ['autodocs'],
};

export default preview;
