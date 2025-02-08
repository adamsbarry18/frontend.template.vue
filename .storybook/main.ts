import path from "path";

export default {
  stories: ["../_resources/stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },

  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
    };
  },

  docs: {},
};
