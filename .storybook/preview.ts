import type { Preview } from "@storybook/vue3";
import "./style.scss";

const preview: Preview = {
  parameters: {
    actions: {},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
