import path from 'path';

export default {
  stories: ['../_resources/stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
    '@chromatic-com/storybook',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  async viteFinal(config) {
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['@storybook/builder-vite'],
    };
    return {
      ...config,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    };
  },

  docs: {},
};
